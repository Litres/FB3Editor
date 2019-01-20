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
			var manager = FBEditor.getEditorManager(),
				els = {},
				nodes = {},
				helper,
				range;

			range = manager.getRangeCursor();
			
			if (!range)
			{
				return false;
			}

			nodes.node = range.start;
			els.node = nodes.node.getElement();

			els.root = els.node.getRoot();
			helper = els.root.getNodeHelper();
			nodes.root = helper.getNode();

			return nodes.root;
		}
	}
);