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

		onKeyDownDelete: function (e)
		{
			var me = this,
				el = me.getElement();

			e.preventDefault();

			// передаем событие родительскому элементу
			el.parent.fireEvent('keyDownDelete', e);
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				el = me.getElement();

			e.preventDefault();

			// передаем событие родительскому элементу
			el.parent.fireEvent('keyDownBackspace', e);
		},

		onPaste: function (e)
		{
			var me = this,
				el = me.getElement();

			e.preventDefault();

			// передаем событие родительскому элементу
			el.parent.fireEvent('paste', e);
		},

		/**
		 * Проверяет создание нового элемента форматирования из выделения.
		 * @param {Selection} sel Выделение.
		 * @return {Boolean} Успешность проверки.
		 */
		checkRangeVerify: function (sel)
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				containers = ['p', 'li', 'subtitle'],
				els = {},
				nodes = {},
				res,
				range;

			// получаем данные из выделения
			range = manager.getRangeCursor();

			if (range.collapsed)
			{
				return false;
			}

			nodes.common = range.common;
			els.common = nodes.common.getElement();

			if (els.common.equal(range.start.getElement()))
			{
				// выделен только текстовый узел
				return true;
			}

			// первый параграф
			nodes.firstP = range.start;
			els.firstP = nodes.firstP.getElement();
			while (!Ext.Array.contains(containers, els.firstP.getName()))
			{
				nodes.firstP = nodes.firstP.parentNode;
				els.firstP = nodes.firstP.getElement();
			}

			// последний параграф
			nodes.lastP = range.end;
			els.lastP = nodes.lastP.getElement();
			while (!Ext.Array.contains(containers, els.lastP.getName()))
			{
				nodes.lastP = nodes.lastP.parentNode;
				els.lastP = nodes.lastP.getElement();
			}

			res = nodes.firstP && nodes.lastP;

			return res;
		}
	}
);