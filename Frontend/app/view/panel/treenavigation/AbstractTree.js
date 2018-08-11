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

        /**
		 * @property {String} Название команды для открытия текущей панели.
         */
        cmdName: '',

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
         * Открывает текущую панель.
         */
        openContent: function ()
        {
            var me = this,
                cmdName = me.cmdName,
				managerXml = FBEditor.view.panel.main.xml.Manager.getInstance(),
				promise,
                cmd;

            // если панель не открыта
            if (!me.isActivePanel())
            {
            	if (!me.isActivePanel('main-xml'))
				{
					promise = Promise.resolve(true);
				}
				else
				{
					// проверяем и синхронизируем xml c моделью
					promise = managerXml.sync();
                }

                promise.then(
                    function (res)
                    {
                        if (res)
                        {
                        	// открываем панель
                            cmd = Ext.create(cmdName);

                            if (cmd.execute())
                            {
                                FBEditor.HistoryCommand.add(cmd);
                            }
                        }
                    }
                );
            }
        },

        /**
         * Активна ли текущая панель.
		 * @param {String} [id] Айди панели, которая проверяется на активность, если ацди не передано,
		 * то проверяется текущая панель.
         * @return {Boolean} true - активна.
         */
        isActivePanel: function (id)
        {
            var me = this,
                contentId = id || me.syncContentId,
                bridge = FBEditor.getBridgeWindow(),
                mainContent,
                res;

            mainContent = bridge.Ext.getCmp('panel-main-content');
            res = mainContent.isActiveItem(contentId);

            return res;
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