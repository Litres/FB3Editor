/**
 * Менеджер проводника ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.ExplorerManager',
	{
		singleton: true,
		requires: [
			'FBEditor.view.window.resource.Resource'
		],

		/**
		 * @property {FBEditor.view.window.resource.Resource} Окно ресурсов.
		 */
		win: null,

		/**
		 * Возвращает окно ресурсов.
		 * @return {FBEditor.view.window.resource.Resource} Окно ресурсов.
		 */
		getWindow: function ()
		{
			var me = this,
				win = me.win;

			if (!win)
			{
				win = Ext.create('FBEditor.view.window.resource.Resource');
				me.win = win;
			}

			return win;
		}
	}
);