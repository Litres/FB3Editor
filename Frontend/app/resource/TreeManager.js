/**
 * Менеджер дерева ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.TreeManager',
	{
		singleton: true,
		requires: [
			'FBEditor.view.window.resource.Tree'
		],

		/**
		 * @property {FBEditor.view.window.resource.Tree} Окно дерева ресурсов.
		 */
		win: null,

		/**
		 * Возвращает окно дерева ресурсов.
		 * @return {FBEditor.view.window.resource.Tree} Окно дерева ресурсов.
		 */
		getWindow: function ()
		{
			var me = this,
				win = me.win;

			if (!win)
			{
				win = Ext.create('FBEditor.view.window.resource.Tree');
				me.win = win;
			}

			return win;
		}
	}
);