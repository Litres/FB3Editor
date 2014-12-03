/**
 * Абстрактный класс для fieldset формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.AbstractFieldset',
	{
		extend: 'Ext.form.FieldSet',
		requires: [
			'FBEditor.view.form.desc.fieldset.AbstractFieldsetController'
		],
		xtype: 'desc-fieldset',
		controller: 'desc.fieldset',
		collapsible: true,
		anchor: '100%',
		listeners: {
			resetFields: 'onResetFields',
			checkExpand: 'onCheckExpand'
		},

		/**
		 * @property {String} Имя дочернего компонента.
		 */
		xtypeChild: '',

		/**
		 * @property {Boolean} Обязательный ли блок.
		 */
		require: false,

		initComponent: function ()
		{
			var me = this,
				req = me.require,
				xtypeChild = me.xtypeChild;

			me.collapsed = req ? false : true;
			me.cls = req ? '' : 'fieldset-optional';
			if (!me.items)
			{
				me.items = [
					{
						xtype: 'form-desc-' + xtypeChild,
						layout: 'anchor',
						defaults: {
							anchor: '100%'
						}
					}
				];
			}
			me.callParent(arguments);
		}
	}
);