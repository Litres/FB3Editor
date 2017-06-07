/**
 * Родительский контейнер каждого объекта.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.item.ObjectItem',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.object.item.ObjectItemController',
			'FBEditor.view.form.desc.relations.object.SearchContainer',
			'FBEditor.view.form.desc.relations.object.CustomContainer'
		],

		xtype: 'form-desc-relations-object-item',
		controller: 'form.desc.relations.object.item',

		cls: 'desc-fieldcontainer',
		layout: 'hbox',

		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'object',
			btnPos: 'end',
			btnCls: 'plugin-fieldcontainerreplicator-big-btn',
			btnStyle: {
				margin: '0 0 0 5px',
				width: '40px',
				height: '65px'
			}
		},

		listeners: {
			resetContainer: 'onResetContainer'
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.object.CustomButton} Кнопка переключения в ручной режим.
		 */
		_customBtn: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.object.CustomContainer} Контейнер данных.
		 */
		_customContainer: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.object.SearchContainer} Контейнер поиска.
		 */
		_searchContainer: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'anchor',
					flex: 1,
					items: [
						{
							xtype: 'form-desc-relations-object-container-custom'
						},
						{
							xtype: 'form-desc-relations-object-container-search'
						}
					]
				}
			];

			me.callParent(arguments);
		},

		isValid: function ()
		{
			var me = this,
				custom = me.getCustomContainer(),
				isValid;

			isValid = custom.isValid();

			return isValid;
		},

		getValues: function ()
		{
			var me = this,
				custom = me.getCustomContainer(),
				values;

			values = custom.getValue();

			return values;
		},

		/**
		 * Переключает контейнер с поиска на данные или обратно.
		 * @param {Boolean} customToSearch Переключить ли контейнер на поиск.
		 */
		switchContainers: function (customToSearch)
		{
			var me = this,
				hidden,
				search,
				custom;

			search = me.getSearchContainer();
			custom = me.getCustomContainer();

			hidden = customToSearch;

			custom.setHidden(hidden);
			search.setHidden(!hidden);
		},

		/**
		 * Возвращает кнопку переключения.
		 * @return {FBEditor.view.form.desc.relations.object.CustomButton}
		 */
		getCustomBtn: function ()
		{
			var me = this,
				btn = me._customBtn;

			btn = btn || me.down('form-desc-relations-object-customBtn');
			me._customBtn = btn;

			return btn;
		},

		/**
		 * Возвращает контейнер данных.
		 * @return {FBEditor.view.form.desc.relations.object.CustomContainer}
		 */
		getCustomContainer: function ()
		{
			var me = this,
				container = me._customContainer;

			container = container || me.down('form-desc-relations-object-container-custom');
			me._customContainer = container;

			return container;
		},

		/**
		 * Возвращает контейнер поиска.
		 * @return {FBEditor.view.form.desc.relations.object.SearchContainer}
		 */
		getSearchContainer: function ()
		{
			var me = this,
				container = me._searchContainer;

			container = container || me.down('form-desc-relations-object-container-search');
			me._searchContainer = container;

			return container;
		}
	}
);