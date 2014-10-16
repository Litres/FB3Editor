/**
 * Открывает описание книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.OpenDesc',
	{
		extend: 'FBEditor.command.AbstractCommand',

		/**
		 * @private
		 * @property {FBEditor.view.window.desc.Desc} Окно описания книги.
		 */
		winDesc: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				bridgeWindow = me.getBridgeWindow(),
				result = false,
				winDesc;

			winDesc = bridgeWindow.Ext.getCmp('window-desc') ||
			          bridgeWindow.Ext.create('FBEditor.view.window.desc.Desc');
			if (winDesc)
			{
				me.winDesc = winDesc;
				result = winDesc.show() ? true : false;
			}

			return result;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				winDesc = me.winDesc;

			if (winDesc)
			{
				winDesc.close();
			}
		}
	}
);