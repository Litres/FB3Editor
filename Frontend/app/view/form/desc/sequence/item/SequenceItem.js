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
			'FBEditor.view.form.desc.sequence.CustomContainer'
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
		 * @property {FBEditor.view.form.desc.sequence.CustomContainer} Контейнер данных.
		 */
		_customContainer: null,

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
		 * @return {FBEditor.view.form.desc.sequence.CustomContainer}
		 */
		getCustomContainer: function ()
		{
			var me = this,
				container = me._customContainer;

			container = container || me.down('form-desc-sequence-container-custom');
			me._customContainer = container;

			return container;
		}
	}
);