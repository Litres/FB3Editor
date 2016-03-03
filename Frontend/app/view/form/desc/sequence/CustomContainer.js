/**
 * Контейнер данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.CustomContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-sequence-container-custom',
		layout: 'anchor',
		flex: 1,

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			number: 'Номер',
			pageEditor: 'Страница редактирования'
		},

		initComponent: function ()
		{
			var me = this,
				prefixName = me.prefixName;

			me.hidden = FBEditor.accessHub;
			me.hidden = FBEditor.desc.Manager.loadingProcess ? false : me.hidden;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					cls: 'block-container', // необходим для выделения блока полей
					items: [
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 80,
								labelAlign: 'right',
								xtype: 'textfield',
								keyEnterAsTab: true
							},
							items: [
								{
									xtype: 'textfieldclear',
									fieldLabel: me.translateText.id,
									name: prefixName + '-id',
									allowBlank: false,
									regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
									regexText: me.translateText.idError,
									cls: 'field-required'
								},
								{
									xtype: 'component',
									name: prefixName + '-link',
									tpl: '<a href="https://hub.litres.ru/pages/any_uuid_redir/?uuid={uuid}"' +
									     ' class="sequence-page-link"' +
									     ' target="_blank" title="' + me.translateText.pageEditor + '">' +
									     '<i class="fa fa-external-link"></i>' +
									     '</a>'
								},
								{
									xtype: 'numberfield',
									name: prefixName + '-number',
									fieldLabel: me.translateText.number,
									cls: 'field-optional'
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							width: 10
						},
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							items: [
								{
									xtype: 'form-desc-title',
									name: prefixName + '-title',
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelWidth: 160,
										labelAlign: 'right'
									}
								}
							]
						}
					]
				}
			];

			me.callParent(arguments);
		}
	}
);