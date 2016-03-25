/**
 * Выделение для элемента table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.table.TableSelection',
	{
		extend: 'FBEditor.editor.element.AbstractSelection',

		execute: function ()
		{
			var me = this,
				sel = window.getSelection(),
				range = sel.getRangeAt(0),
				els = {};

			if (range && !range.collapsed)
			{
				els.common = range.commonAncestorContainer.getElement();

				if (els.common.isTable || els.common.isTr)
				{
					//console.log('range', range);
				}
			}
		}
	}
);