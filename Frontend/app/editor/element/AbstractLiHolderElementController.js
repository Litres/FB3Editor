/**
 * Абстрактный контроллер списков, содержащих элемент li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractLiHolderElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel)
		{
			var me = this,
				els = {},
				nodes = {},
				res,
				range,
				nameElements,
				sch;

			// получаем данные из выделения
			range = sel.getRangeAt(0);

			// первый параграф
			nodes.first = range.startContainer;
			els.first = nodes.first.getElement();
			while (!els.first.isP && !els.first.isRoot)
			{
				nodes.first = nodes.first.parentNode;
				els.first = nodes.first.getElement();
			}

			if (!els.first.isP)
			{
				return false;
			}

			nodes.parent = nodes.first.parentNode;
			els.parent = nodes.parent.getElement();
			els.pos = els.parent.getChildPosition(els.first);

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = FBEditor.editor.Manager.getNamesElements(els.parent);
			nameElements.splice(els.pos, 1, me.getNameElement());

			// проверяем элемент по схеме
			sch = FBEditor.editor.Manager.getSchema();
			els.name = els.parent.xmlTag;
			res = sch.verify(els.name, nameElements) ? nodes.first : false;

			return res;
		}
	}
);