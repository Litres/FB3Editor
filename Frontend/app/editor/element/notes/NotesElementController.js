/**
 * Контроллер элемента notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.notes.NotesElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var manager = FBEditor.editor.Manager,
				rootNode,
				root,
				range,
				viewportId,
				res;

			range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

			root = manager.getContent();

			if (range)
			{
				viewportId = range.startContainer.viewportId;
			}
			else
			{
				viewportId = Ext.Object.getKeys(root.nodes)[0];
			}

			rootNode = root.nodes[viewportId];

			// ставим курсор в любое место текста
			manager.setCursor(
				{
					startNode: rootNode.lastChild
				}
			);

			res = root.getChildrenCountByProp('isNotes', true);

			return !res ? rootNode : null;
		}
	}
);