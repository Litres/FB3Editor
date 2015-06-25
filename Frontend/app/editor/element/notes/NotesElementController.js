/**
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.notes.NotesElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var rootNode,
				rootEl,
				range,
				viewportId,
				res;

			range = sel.getRangeAt(0);
			rootEl = FBEditor.editor.Manager.getContent();
			viewportId = range.startContainer.viewportId;
			rootNode = rootEl.nodes[viewportId];
			res = rootEl.getChildrenCountByProp('isNotes', true);

			return !res ? rootNode : null;
		}
	}
);