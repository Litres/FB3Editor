/**
 * Серия, в которой выпущено произведение.
 * Например "Детство, Отрочество, Юность" для книги Толстого "Детство".
 * Не путать серию с названием периодического издания.
 * Вложенность серий обозначает "многоуровневые" серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.Sequence',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.sequence.SequenceController'
		],
		id: 'form-desc-sequence',
		xtype: 'form-desc-sequence',
		controller: 'form.desc.sequence',
		name: 'form-desc-plugin-fieldcontainerreplicator',
		layout: 'anchor',

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: f5425391-da0f-102b-ad52-84a7b9a81fa0',
			number: 'Номер'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
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
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							anchor: '100%',
							defaults: {
								anchor: '100%'
							},
							items: [
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelWidth: 160,
										labelAlign: 'right',
										xtype: 'textfield'
									},
									items: [
										{
											xtype: 'textfieldclear',
											fieldLabel: me.translateText.id,
											name: 'sequence-id',
											allowBlank: false,
											regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
											regexText: me.translateText.idError
										},
										{
											xtype: 'numberfield',
											name: 'sequence-number',
											fieldLabel: me.translateText.number,
											cls: 'field-optional'
										}
									]
								},
								{
									xtype: 'fieldcontainer',
									width: 50
								},
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									items: [
										{
											xtype: 'form-desc-title',
											name: 'sequence-title',
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
					]
				}
				/*
				{
					xtype: 'desc-fieldcontainer',
					layout: 'anchor',
					hideLabel: true,
					anchor: '100%',
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'sequence',
						btnPos: 'end',
						enableBtnPut: true,
						btnStyle: {
							margin: '0 0 0 2px'
						}
					},
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							width: '100%',
							hideLabel: true,
							combineErrors: true,
							msgTarget: 'side',
							margin: '0 0 2',
							defaults: {
								anchor: '100%',
								flex: 1,
								labelAlign: 'top',
								labelPad: '0',
								xtype: 'textfield',
								msgTarget: 'none',
								hideLabel: true
							},
							items: [
								{
									name: 'sequence-id',
									fieldLabel: me.translateText.id,
									allowBlank: false,
									regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
									regexText: me.translateText.idError
								},
								{
									xtype: 'form-desc-title',
									name: 'sequence-title',
									flex: 0,
									width: 280,
									layout: 'fit',
									defaults: {
										labelWidth: 140,
										labelAlign: 'right',
										margin: '0 0 2 0'
									}
								},
								{
									xtype: 'numberfield',
									name: 'sequence-number',
									fieldLabel: me.translateText.number
								}
							]
						}
				    ]
				}*/
			];
			me.callParent(arguments);
		}
	}
);