/**
 * Абстрактный класс для деревьев навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.AbstractTree',
	{
		extend: 'Ext.tree.Panel',
		listeners: {
			itemclick: 'onItemClick',
			beforeitemclick: 'onBeforeItemClick'
		},

		/**
		 * @property {String} Id панели контента, с которой связано дерево.
		 */
		syncContentId: '',

		afterRender: function ()
		{
			var me = this;

			me.syncContent();
			me.callParent(arguments);
		},

		/**
		 * @abstract
		 * Возвращает id панели контента, с которой связано дерево.
		 * @return {String} Id панели контента.
		 */
		getContentId: function ()
		{
			return this.syncContentId;
		},

		/**
		 * Снимает выделение с дерева.
		 */
		clearSelection: function ()
		{
			var me = this,
				selection = me.getSelection(),
				view = me.getView();

			if (selection.length)
			{
				view.deselect(selection[0], false);
			}
		},

		/**
		 * @private
		 * Синхронизирует состояние дерева с панелью контента.
		 * Для соответствующего контента должно быть выделено соответствующее дерево.
		 */
		syncContent: function ()
		{
			var me = this,
				contentId = me.getContentId(),
				bridgeWindow = FBEditor.getBridgeWindow(),
				content,
				activeItem;

			content = bridgeWindow.Ext.getCmp('panel-main-content');
			activeItem = content.getLayout().getActiveItem();
			if (activeItem.id === contentId)
			{
				me.selectPath('/root');
			}
		}
	}
);