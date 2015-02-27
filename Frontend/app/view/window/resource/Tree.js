/**
 * Окно дерева ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.resource.Tree',
	{
		extend: 'Ext.Window',
		xtype: 'window-resource-tree',
		id: 'window-resource-tree',
		title: 'Перемещение ресурса',
		height: '60%',
		modal: true,
		closeAction: 'hide',
		layout: 'vbox',

		translateText: {
			moveTo: 'Переместить',
			cancel: 'Отмена'
		},

		/**
		 * @property {String} Имя перемещаего ресурса.
		 */
		nameResource: '',

		/**
		 * @property {String} Имя папки, в которую необходимо переместить ресурс.
		 */
		destinationFolder: '',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'box',
					id: 'window-panel-resources-tree-name',
					cls: 'window-panel-resources-tree-name',
					tpl: 'Переместить ресурс <span>{name}</span><tpl if="folder"> в <span>{folder}</span></tpl>'
				},
				{
					xtype: 'panel',
					id: 'window-panel-resources-tree-navigation',
					flex: 1,
					width: 400,
					minWidth: 400,
					bodyPadding: 5,
					overflowY: 'auto',
					buttonAlign: 'left',
					buttons: [
						{
							text: me.translateText.moveTo,
							scope: me,
							handler: function ()
							{
								var bridge = FBEditor.getBridgeWindow(),
									manager,
									result;

								if (!me.destinationFolder)
								{
									return false;
								}
								try
								{
									manager = bridge.FBEditor.resource.Manager;
									result = manager.moveResource(me.nameResource, me.destinationFolder);
									if (result)
									{
										manager.setSelectFunction(null);
										me.close();
									}
								}
								catch (e)
								{
									Ext.log(
										{
											level: 'error',
											msg: e,
											dump: e
										}
									);
									Ext.Msg.show(
										{
											title: 'Ошибка',
											message: 'Невозможно переместить ресурс ' + (e ? '(' + e + ')' : ''),
											buttons: Ext.MessageBox.OK,
											icon: Ext.MessageBox.ERROR
										}
									);
								}
							}
						},
						{
							text: me.translateText.cancel,
							scope: me,
							handler: function ()
							{
								this.close();
							}
						}
					]
				}
			];
			me.callParent(arguments);
		},

		beforeShow: function ()
		{
			var me = this,
				windowPanelResourcesNavigation = me.getWindowPanelResourcesNavigation(),
				panelResourcesNavigation = me.getPanelResourcesNavigation();

			// перемещаем панель дерева ресурсов в окно
			windowPanelResourcesNavigation.add(panelResourcesNavigation);

			me.callParent(arguments);
		},

		onHide: function ()
		{
			var me = this,
				panelTreenavigation = me.getPanelTreenavigation(),
				panelResourcesNavigation = me.getPanelResourcesNavigation();

			// возвращаем панель дерева ресурсов в панель навигации
			panelTreenavigation.insert(1, panelResourcesNavigation);

			me.callParent(arguments);
		},

		getWindowPanelResourcesNavigation: function ()
		{
			return Ext.getCmp('window-panel-resources-tree-navigation');
		},

		getWindowPanelResourcesName: function ()
		{
			return Ext.getCmp('window-panel-resources-tree-name');
		},

		getPanelTreenavigation: function ()
		{
			return Ext.getCmp('panel-treenavigation');
		},

		getPanelResourcesNavigation: function ()
		{
			return Ext.getCmp('panel-resources-navigation');
		},

		/**
		 * Устанавливает имя ресурса.
		 * @param {String} name Имя перемещаего ресурса.
		 */
		setNameResource: function (name)
		{
			var me = this,
				panel = me.getWindowPanelResourcesName();

			me.nameResource = name;
			panel.setData({name: name, folder: me.destinationFolder});
		},

		/**
		 * Устанавливает имя папки, в которую необходимо переместить ресурс.
		 * @param {String} name Имя папки.
		 */
		setFolder: function (name)
		{
			var me = this,
				panel = me.getWindowPanelResourcesName();

			me.destinationFolder = name ? name : '/';
			panel.setData({name: me.nameResource, folder: me.destinationFolder});
		}
	}
);