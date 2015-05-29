/**
 * Кнотроллер элемента annotation.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.annotation.AnnotationElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNameElementsVerify: function (nodes)
		{
			var me = this,
				els = {},
				nameElements,
				name,
				pos = 0;

			name = me.getNameElement();
			nodes.first = nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();
			els.first = nodes.first ? nodes.first.getElement() : null;
			nameElements = FBEditor.editor.Manager.getNamesElements(els.parent);
			while (els.first && (els.first.xmlTag === 'epigraph' || els.first.xmlTag === 'title'))
			{
				pos++;
				nodes.first = nodes.first.nextSibling;
				els.first = nodes.first ? nodes.first.getElement() : null;
			}
			nameElements.splice(pos, 0, name);

			return nameElements;
		}
	}
);