/**
 * Открывает текст книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.OpenBody',
	{
		extend: 'FBEditor.command.AbstractCommand',

		/**
		 * @private
		 * @property {Ext.Component} Активный компонент контента.
		 */
		activeItem: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				bridgeWindow = me.getBridgeWindow(),
				result = true,
				content;

			content = bridgeWindow.Ext.getCmp('panel-main-content');
			me.activeItem = content.getLayout().getActiveItem();
			content.fireEvent('contentEditor');

			return result;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				activeItem = me.activeItem,
				bridgeWindow = me.getBridgeWindow(),
				content;

			content = bridgeWindow.Ext.getCmp('panel-main-content');
			content.setActiveItem(activeItem);
		}
	}
);