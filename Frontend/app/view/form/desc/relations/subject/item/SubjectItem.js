/**
 * Родительский контейнер каждой персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.item.SubjectItem',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.SearchContainer',
			'FBEditor.view.form.desc.relations.subject.CustomContainer',
			'FBEditor.view.form.desc.relations.subject.item.SubjectItemController'
		],
		
		xtype: 'form-desc-relations-subject-item',
		controller: 'form.desc.relations.subject.item',

		cls: 'desc-fieldcontainer',
		
		listeners: {
			resetContainer: 'onResetContainer',
			loadInnerData: 'onLoadInnerData',
			resizeButtons: 'onResizeButtons',
			afterRenderPlugin: 'onAfterRenderPlugin'
		},
		
		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'subject',
			btnPos: 'end',
			btnCls: 'plugin-fieldcontainerreplicator-big-btn',
			btnStyle: {
				margin: '0 0 0 5px'
			},
			btnSize: {
				bigWidth: 40,
				bigHeight: 65,
				smallWidth: 40,
				smallHeight: 25
			},
			alwaysInsertFirst: true
		},

		layout: 'hbox',

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.CustomButton} Кнопка переключения в ручной режим.
		 */
		_customBtn: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.CustomContainer} Контейнер данных.
		 */
		_customContainer: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.SearchContainer} Контейнер поиска.
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
					defaults: {
						anchor: '100%'
					},
					items: [
						{
							xtype: 'form-desc-relations-subject-container-custom'
						},
						{
							xtype: 'form-desc-relations-subject-container-search'
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
				hidden = customToSearch,
				search = me.getSearchContainer(),
				custom = me.getCustomContainer();

			custom.setHidden(hidden);
			search.setHidden(!hidden);
		},

		/**
		 * Возвращает кнопку переключения в ручной режим.
		 * @return {FBEditor.view.form.desc.relations.subject.CustomButton}
		 */
		getCustomBtn: function ()
		{
			var me = this,
				btn = me._customBtn;

			btn = btn || me.down('form-desc-relations-subject-customBtn');
			me._customBtn = btn;
			
			return btn;
		},

		/**
		 * Возвращает контейнер данных.
		 * @return {FBEditor.view.form.desc.relations.subject.CustomContainer}
		 */
		getCustomContainer: function ()
		{
			var me = this,
				container = me._customContainer;

			container = container || me.down('form-desc-relations-subject-container-custom');
			me._customContainer = container;

			return container;
		},

		/**
		 * Возвращает контейнер поиска.
		 * @return {FBEditor.view.form.desc.relations.subject.SearchContainer}
		 */
		getSearchContainer: function ()
		{
			var me = this,
				container = me._searchContainer;

			container = container || me.down('form-desc-relations-subject-container-search');
			me._searchContainer = container;

			return container;
		}
	}
);