/**
 * Менеджер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.Manager',
	{
		extend: 'FBEditor.editor.Manager',

		/**
		 * @property {Boolean} Признак того, что менедежр принадлежит редактору текста книги.
		 */
		isMainEditor: true,

		createContent: function ()
		{
			var me = this;

			me.callParent(arguments);

			// обновляем дерево навигации по тексту
			me.updateTree();
		},

		/**
		 * Обновляет дерево навигации по тексту.
		 */
		updateTree: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeNavigation();

			if (bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-body-navigation'))
			{
				bridge.Ext.getCmp('panel-body-navigation').loadData(me.content);
			}
			else
			{
				Ext.defer(
					function ()
					{
						me.updateTree();
					},
					200
				);
			}
		}
	}
);