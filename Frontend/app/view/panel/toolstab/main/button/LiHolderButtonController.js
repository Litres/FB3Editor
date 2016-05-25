/**
 * Контроллер кнопки списков, содержащих элементы li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.LiHolderButtonController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',

		onSync: function ()
		{
			var me = this,
				btn = me.getView();

			// можно ли создать список
			if (!btn.isActiveSelection())
			{
				// можно ли создать вложенный список
				if (me.allowInnerList())
				{
					btn.enable();
				}
				else
				{
					btn.disable();
				}
			}
			else
			{
				btn.enable();
			}
		},

		/**
		 * Проверяет можно ли создать вложенный список.
		 * @return {Boolean}
		 */
		allowInnerList: function ()
		{
			var els = {},
				nodes = {},
				manager = FBEditor.getEditorManager(),
				range,
				res;

			range = manager.getRange();

			if (!range)
			{
				return false;
			}

			nodes.node = range.start;
			els.node = nodes.node.getElement ? nodes.node.getElement() : null;

			// внешний список
			els.li = els.node ? els.node.getParentName('li')  : null;

			// вложенный список не может быть первым элементом внешнего списка
			res = els.li && els.li.prev() ? true : false;

			return res;
		}
	}
);