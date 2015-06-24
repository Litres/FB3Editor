/**
 * Кнотроллер элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.img.ImgElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onKeyDown: function (e)
		{
			var me = this,
				node = e.target,
				parentNode = node.parentNode;

			if (e.keyCode === Ext.event.Event.DELETE || e.keyCode === Ext.event.Event.BACKSPACE)
			{
				// удаляем изображение
				parentNode.removeChild(node);
				FBEditor.editor.Manager.setFocusElement(parentNode.getElement());
			}
			e.preventDefault();
			e.stopPropagation();

			return false;
		},

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				els = {},
				nodes = {},
				res,
				sch,
				name,
				range,
				nameElements;

			// данные выделения
			range = opts.range;
			nodes.node = range.start;
			nodes.parent = nodes.node.parentNode;

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = ['img'];//me.getNameElementsVerify(nodes);

			// проверяем элемент по схеме
			sch = FBEditor.editor.Manager.getSchema();
			els.parent = nodes.parent.getElement();
			name = els.parent.xmlTag;
			res = sch.verify(name, nameElements) ? nodes.node : false;

			return res;
		}
	}
);