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
			var els = {},
				nodes = {},
				range,
				viewportId;

			range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

			if (!range)
			{
				return false;
			}

			nodes.node = range.startContainer;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();

			els.root = els.node.getRoot();
			nodes.root = els.root.nodes[viewportId];

			return nodes.root;
		}
	}
);