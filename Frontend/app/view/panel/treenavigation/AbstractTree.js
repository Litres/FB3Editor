/**
 * Абстрактный класс для деревьев навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.AbstractTree',
	{
		extend: 'Ext.tree.Panel',

		cls: 'panel-treenavigation',

		listeners: {
			itemclick: 'onItemClick',
			itemdblclick: 'onItemDblClick',
			beforeitemclick: 'onBeforeItemClick',
			selectionchange: 'onSelectionChange',
			select: 'onSelect'
		},

		/**
		 * @property {String} Id панели контента, с которой связано дерево.
		 */
		syncContentId: '',

		afterRender: function ()
		{
			var me = this;

			Ext.defer(
				function ()
				{
					me.syncContent();
				},
			    2500
			);

			me.callParent(arguments);
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
				contentId = me.syncContentId,
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