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
		 * @property {FBEditor.view.form.desc.relations.object.CustomContainer} Контейнер данных.
		 */
		_customContainer: null,

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
		}
	}
);