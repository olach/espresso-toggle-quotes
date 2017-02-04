action.performWithContext = function(context, outError) {
	
	// Setup our recipe:
	var recipe = new CETextRecipe();
	
	// Setup some SXSelectors:
	var selectorQuotedString = new SXSelector('string.quoted');
	var selectorQuotedStringValue = new SXSelector('string.quoted > value');
	var selectorQuote = new SXSelector('punctuation.definition');
	
	// Loop through all selections:
	for (var i = 0; i < context.selectedRanges.length; i++) {
		
		// Get selection:
		var selection = context.selectedRanges[i];
		
		// Find SXZone at start of selection:
		var zone = context.syntaxTree.zoneAtCharacterIndex(selection.location);
		
		// Some quoted strings has a child zone called 'value'.
		// If that's the case, switch to its parent zone. Should be a 'string.quoted' zone:
		if (selectorQuotedStringValue.matches(zone)) {
			zone = zone.parent;
		}
		
		// Make sure that current zone (string) is a quoted string:
		if (selectorQuotedString.matches(zone)) {
			// Loop through all child zones (the quote characters):
			for (var index = 0; index < zone.childCount; index++) {
				var childZone = zone.childAtIndex(index);
				
				// Make sure that this child zone is a quote character:
				if (selectorQuote.matches(childZone)) {
					// Toggle the quote character:
					if (childZone.text == "'") {
						var newQuote = '"';
					} else {
						var newQuote = "'";
					}
					
					// Add this change to the recipe:
					recipe.replaceRange(childZone.range, newQuote);
				}
			}
		}
	}
	
	// Output all changes to the document:
	return context.applyTextRecipe(recipe);
};
