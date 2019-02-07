/**
 * Контроллер панели имени файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.filename.FileNameController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.filename',

		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				bridge = FBEditor.getBridgeWindow(),
				routeManager = bridge.FBEditor.route.Manager;
			
			// скрываем
			if (routeManager.isSetParam('only_text'))
			{
				return;
			}

			view.setActiveItem('panel-filename-field');
		},

		onAfterRender: function ()
		{
			var me = this,
				name = FBEditor.file.Manager.defaultFb3FileName;

			me.onSetName(name);
			me.onCheckPosition();
		},

		/**
		 * Устанавливает имя файла.
		 * @param {String} val Имя.
		 */
		onSetName: function (val)
		{
			var me = this,
				view = me.getView(),
				items = view.items;

			items.each(
				function (item)
				{
					item.setValue(val);
				}
			);
			
			view.setActiveItem('panel-filename-display');
		},

		/**
		 * Корректирует размеры и позицию панели имени файла.
		 */
		onCheckPosition: function ()
		{
			var me = this,
				view = me.getView(),
				tabsWidth,
				logoWidth,
				tools;

			if (view.rendered)
			{
				tools = Ext.getCmp('panel-main-tools');
				tabsWidth = view.tabsWidth;
				logoWidth = view.logoWidth;
				view.setWidth(tools.getWidth() - tabsWidth - logoWidth);
			}
		}
	}
);