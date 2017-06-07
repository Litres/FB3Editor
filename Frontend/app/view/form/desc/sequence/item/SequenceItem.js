/**
 * Родительский контейнер каждой серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.item.SequenceItem',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.sequence.item.SequenceItemController',
			'FBEditor.view.form.desc.sequence.CustomContainer',
			'FBEditor.view.form.desc.sequence.SearchContainer'
		],

		xtype: 'form-desc-sequence-item',
		controller: 'form.desc.sequence.item',
		
		cls: 'desc-fieldcontainer',
		layout: 'anchor',
		anchor: '100%',
		
		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'sequence',
			btnPos: 'end',
			btnCls: 'plugin-fieldcontainerreplicator-big-btn',
			enableBtnPut: true,
			btnStyle: {
				margin: '0 0 0 5px',
				width: '40px',
				height: '65px'
			}
		},
		
		listeners: {
			putData: 'onPutData',
			addFields: 'onAddFields',
			putFields: 'onPutFields',
			removeFields: 'onRemoveFields',
			resetContainer: 'onResetContainer'
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.sequence.Sequence} Родительский контейнер всех серий.
		 */
		_sequenceContainer: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.sequence.CustomButton} Кнопка переключения в ручной режим.
		 */
		_customBtn: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.sequence.CustomContainer} Контейнер данных.
		 */
		_customContainer: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.sequence.SearchContainer} Контейнер поиска.
		 */
		_searchContainer: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.sequence.item.SequenceItem} Контейнер вложенной серии.
		 */
		_sequenceInner: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'anchor',
							flex: 1,
							items: [
								{
									xtype: 'form-desc-sequence-container-custom'
								},
								{
									xtype: 'form-desc-sequence-container-search'
								}
							]
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
				customInner = me.getCustomInnerContainer(),
				isValid;

			isValid = custom.isValid();
			isValid = isValid && customInner ? customInner.isValid() : isValid;

			return isValid;
		},
		
		getValues: function ()
		{
			var me = this,
				custom = me.getCustomContainer(),
				itemInner = me.getSequenceInner(),
				values;

			values = custom.getValue();

			if (itemInner)
			{
				values.sequence = itemInner.getValues();
			}

			values = me.removeEmptyValues(values);

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
		 * Возвращает родительский контейнер всех серий.
		 * @return {FBEditor.view.form.desc.sequence.Sequence}
		 */
		getSequenceContainer: function ()
		{
			var me = this,
				container = me._sequenceContainer;

			container = container || me.up('form-desc-sequence');
			me._sequenceContainer = container;

			return container;
		},

		/**
		 * Возвращает кнопку переключения.
		 * @return {FBEditor.view.form.desc.sequence.CustomButton}
		 */
		getCustomBtn: function ()
		{
			var me = this,
				btn = me._customBtn;

			btn = btn || me.down('form-desc-sequence-customBtn');
			me._customBtn = btn;

			return btn;
		},

		/**
		 * Возвращает контейнер вложенной секции.
		 * @return {FBEditor.view.form.desc.sequence.item.SequenceItem}
		 */
		getSequenceInner: function ()
		{
			var me = this,
				container = me._sequenceInner;

			container = container || me.items.getAt(1);
			me._sequenceInner = container;

			return container;
		},

		/**
		 * Возвращает вложенный контейнер данных.
		 *
		 * @return {FBEditor.view.form.desc.sequence.CustomContainer}
		 */
		getCustomInnerContainer: function ()
		{
			var me = this,
				sequenceInner = me.getSequenceInner(),
				container = me._customInnerContainer;

			container = container || (sequenceInner ? sequenceInner.down('form-desc-sequence-container-custom') : null);
			me._customInnerContainer = container;

			return container;
		},

		/**
		 * Возвращает контейнер данных.
		 * 
		 * @return {FBEditor.view.form.desc.sequence.CustomContainer}
		 */
		getCustomContainer: function ()
		{
			var me = this,
				container = me._customContainer;

			container = container || me.down('form-desc-sequence-container-custom');
			me._customContainer = container;

			return container;
		},

		/**
		 * Возвращает контейнер поиска.
		 * 
		 * @return {FBEditor.view.form.desc.sequence.SearchContainer}
		 */
		getSearchContainer: function ()
		{
			var me = this,
				container = me._searchContainer;

			container = container || me.down('form-desc-sequence-container-search');
			me._searchContainer = container;

			return container;
		}
	}
);