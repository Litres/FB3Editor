/**
 * Контроллер элемента note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.note.NoteElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNameElementsVerify: function (nodes)
		{
			var me = this,
				els = {},
				nameElements,
				name;

			name = me.getNameElement();
			nodes.node = nodes.parent.getElement().xmlTag === name ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			nodes.first = nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();
			els.first = nodes.first ? nodes.first.getElement() : null;
			nameElements = FBEditor.editor.Manager.getNamesElements(els.parent);
			if (!els.first.isTitle)
			{
				nameElements.unshift(name);
			}
			else
			{
				nameElements.splice(1, 0, name);
			}

			return nameElements;
		}
	}
);