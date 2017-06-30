/**
 * Кнопка сохранения книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.saveas.SaveAs',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.saveas.SaveAsController'
		],

		id:'panel-toolstab-file-button-saveas',
		xtype: 'panel-toolstab-file-button-saveas',
		controller: 'panel.toolstab.file.button.saveas',
		
		listeners: {
			click: 'onClick'
		},

		iconCls: 'fa fa-download',
		tooltipType: 'title',

		translateText: {
			save: 'Сохранить книгу (локально)',
			loadResources: 'Загружаются ресурсы с хаба...'
		},

		initComponent: function ()
		{
			var me = this,
				resourcesManager = FBEditor.resource.Manager,
				resourcesLoader = resourcesManager.getLoader(),
				loaderObserver = resourcesLoader.getObserver();

			me.text = me.translateText.save;

			// подписываем кнопку на событие загрузки всех ресурсов
			loaderObserver.addListener('beforeLoadResources', me.beforeLoadResources, me);
			loaderObserver.addListener('afterLoadResources', me.afterLoadResources, me);

			me.callParent(arguments);
		},

		/**
		 * Вызывается перед загрузкой всех ресурсов, чтобы деактивировать кнопку.
		 */
		beforeLoadResources: function ()
		{
			var me = this;

			if (me.rendered)
			{
				me.setIconCls('fa fa-spinner fa-pulse');
				me.setTooltip(me.translateText.loadResources);
				me.setDisabled(true);
			}
			else
			{
				me.iconCls = 'fa fa-spinner fa-pulse';
				me.tooltip = me.translateText.loadResources;
				me.disabled = true;
			}
		},

		/**
		 * Вызывается после загрузки всех ресурсов, чтобы активировать кнопку.
		 */
		afterLoadResources: function ()
		{
			var me = this;

			if (me.rendered)
			{
				me.setIconCls('fa fa-download');
				me.setTooltip(me.translateText.save);
				me.setDisabled(false);
			}
			else
			{
				me.iconCls = 'fa fa-download';
				me.tooltip = me.translateText.save;
				me.disabled = false;
			}
		}
	}
);