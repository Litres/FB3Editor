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
			loadInnerData: 'onLoadInnerData'
		},
		
		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'subject',
			btnPos: 'end',
			btnCls: 'plugin-fieldcontainerreplicator-big-btn',
			btnStyle: {
				margin: '0 0 0 5px',
				width: '40px',
				height: '65px'
			},
			alwaysInsertFirst: true
		},

		layout: 'hbox',

		prefixName: 'relations-subject',

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
					items: [
						{
							xtype: 'form-desc-relations-subject-container-custom',
							prefixName: me.prefixName
						},
						{
							xtype: 'form-desc-relations-subject-container-search'
						}
					]
				}
			];
			
			me.callParent(arguments);
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