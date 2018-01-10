/**
 * Панель отображения ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.view.ResourcesView',
	{
		extend: 'Ext.view.View',
		requires: [
			'FBEditor.view.panel.resources.view.ResourcesViewController',
			'FBEditor.store.resource.Resource',
			'FBEditor.view.panel.resources.tpl.GreatResource',
			'FBEditor.view.panel.resources.tpl.LargeResource',
			'FBEditor.view.panel.resources.tpl.NormalResource',
			'FBEditor.view.panel.resources.tpl.SmallResource',
			'FBEditor.view.panel.resources.tpl.ListResource',
			'FBEditor.view.panel.resources.tpl.TableResource'
		],

		xtype: 'view-resources',
		id: 'view-resources',
		controller: 'view.resources',

        listeners: {
            focuschange: 'onFocusChange',
            itemdblclick: 'onItemDblClick',
            itemclick: 'onItemClick',
			itemkeydown: 'onItemKeyDown'
        },

		itemSelector: 'div.resource-thumb-wrap',
		emptyText: 'Нет доступных ресурсов',
		deferEmptyText: false,

		/**
		 * @property {Object} Типы шаблонов отображения.
		 */
		tplTypes: {
			great: 'GreatResource',
			large: 'LargeResource',
			normal: 'NormalResource',
			small: 'SmallResource',
			list: 'ListResource',
			table: 'TableResource'
		},

		/**
		 * @property {String} Тип шаблона по умолчанию.
		 */
		tplDefaultType: 'great',

        /**
		 * @private
		 * @property {FBEditor.view.panel.resources.Resources} Панель ресурсов.
         */
        panelResources: null,

		initComponent: function ()
		{
			var me = this,
				tplType = me.tplTypes[me.tplDefaultType],
				tplName;

			tplName = me.getTplName(tplType);
			me.tpl = Ext.create(tplName);
			me.store = Ext.create('FBEditor.store.resource.Resource');

			me.callParent(arguments);
		},

		/**
		 * Устанавливает данные ресурсов.
		 * @param {Object} data Данные.
		 */
		setStoreData: function (data)
		{
			var me = this,
				store = me.store;

			store.setData(data);
		},

		/**
		 * Устанавливает новый шаблон отображения.
		 * @param {String} type Тип шаблона.
		 */
		setTpl: function (type)
		{
			var me = this,
				tplName = me.getTplName(type);

			me.tpl = Ext.create(tplName);
			me.refresh();
		},

		/**
		 * Возвращает имя шаблона отображения.
		 * @param {String} type Тип шаблона.
		 * @return {String} Имя шаблона.
		 */
		getTplName: function (type)
		{
			var me = this,
				types = me.tplTypes,
				tplName;

			tplName = types[type] ? types[type] : types[me.tplDefaultType];
			tplName = 'FBEditor.view.panel.resources.tpl.' + tplName;

			return tplName;
		},

        /**
		 * Возвращает панель ресурсов.
         * @return {FBEditor.view.panel.resources.Resources}
         */
        getPanelResources: function ()
		{
			var me = this,
				panelResources = me.panelResources;

            panelResources = panelResources || me.up('panel-resources');
            me.panelResources = panelResources;

			return panelResources;
		}
	}
);