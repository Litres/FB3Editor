/**
 * Абстрактный контроллер элементов форматирования текста.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		createFromRange: true,

		onKeyDownEnter: function (e)
		{
			var me = this,
				el = me.getElement();

			e.preventDefault();

			// передаем событие родительскому элементу
			el.parent.fireEvent('keyDownEnter', e);
		},

		onKeyDownDelete: function (e)
		{
			var me = this,
				el = me.getElement();

			e.preventDefault();

			// передаем событие родительскому элементу
			el.parent.fireEvent('keyDownDelete', e);
		},

		/**
		 * Проверяет создание нового элемента форматирования из выделения.
		 * @param {Selection} sel Выделение.
		 * @return {Boolean} Успешность проверки.
		 */
		checkRangeVerify: function (sel)
		{
			var me = this,
				els = {},
				nodes = {},
				containers = ['p', 'li', 'subtitle'],
				res,
				range;

			// получаем данные из выделения
			range = sel.getRangeAt(0);

			if (range.collapsed)
			{
				return false;
			}

			nodes.common = range.commonAncestorContainer;
			els.common = nodes.common.getElement();

			if (els.common.elementId === range.startContainer.getElement().elementId)
			{
				// выделен только текстовый узел
				return true;
			}

			// первый параграф
			nodes.firstP = range.startContainer;
			els.firstP = nodes.firstP.getElement();
			while (!Ext.Array.contains(containers, els.firstP.xmlTag))
			{
				nodes.firstP = nodes.firstP.parentNode;
				els.firstP = nodes.firstP.getElement();
			}

			// последний параграф
			nodes.lastP = range.endContainer;
			els.lastP = nodes.lastP.getElement();
			while (!Ext.Array.contains(containers, els.lastP.xmlTag))
			{
				nodes.lastP = nodes.lastP.parentNode;
				els.lastP = nodes.lastP.getElement();
			}

			res = nodes.firstP && nodes.lastP;

			return res;
		}
	}
);