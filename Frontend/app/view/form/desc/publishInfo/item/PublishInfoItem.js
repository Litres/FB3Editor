/**
 * Родительский контейнер каждого отдельного блока о бумажной информации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.item.PublishInfoItem',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.publishInfo.item.PublishInfoItemController',
			'FBEditor.view.form.desc.publishInfo.biblio.Biblio',
			'FBEditor.view.form.desc.publishInfo.isbn.Isbn',
			'FBEditor.view.form.desc.publishInfo.sequence.Sequence',
			'FBEditor.view.form.desc.publishInfo.title.Title'
		],

		xtype: 'form-desc-publishInfo-item',
		controller: 'form.desc.publishInfo.item',

		cls: 'desc-fieldcontainer',

		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'publishInfo',
			btnPos: 'end',
			btnCls: 'plugin-fieldcontainerreplicator-big-btn',
			btnStyle: {
				margin: '0 0 0 5px',
				width: '40px',
				height: '65px'
			}
		},
		
		layout: 'hbox',

		prefixName: '',

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.publishInfo.biblio.Biblio} Библиографическое описание.
		 */
		_biblio: null,

		translateText: {
			title: 'Название',
			publisher: 'Издательство',
			city: 'Город',
			year: 'Год',
			biblio: 'Библиограф. описание'
		},
		
		initComponent: function ()
		{
			var me = this,
				prefixName = me.prefixName;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					cls: 'block-container', // необходим для выделения блока полей
					flex: 1,
					layout: 'anchor',
					defaults: {
						anchor: '100%',
						labelWidth: 130,
						labelAlign: 'right',
						keyEnterAsTab: true
					},
					items: [
						{
							xtype: 'form-desc-publishInfo-title',
							name: prefixName + '-title',
							allowBlank: false,
							fieldLabel: me.translateText.title,
							cls: 'field-required',
							plugins: 'fieldCleaner'
						},
						{
							xtype: 'desc-fieldcontainer',
							items: [
								{
									xtype: 'form-desc-biblio-description',
									name: prefixName + '-biblio-description'
								}
							],
							fieldLabel: me.translateText.biblio,
							cls: 'field-optional'
						},
						{
							xtype: 'textfield',
							name: prefixName + '-publisher',
							fieldLabel: me.translateText.publisher,
							cls: 'field-optional',
							plugins: 'fieldCleaner'
						},
						{
							xtype: 'textfield',
							name: prefixName + '-city',
							fieldLabel: me.translateText.city,
							cls: 'field-optional',
							plugins: 'fieldCleaner'
						},
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 130,
								labelAlign: 'right',
								keyEnterAsTab: true
							},
							items: [
								{
									xtype: 'textfield',
									name: prefixName + '-year',
									fieldLabel: me.translateText.year,
									cls: 'field-optional',
									plugins: 'fieldCleaner'
								},
								{
									xtype: 'form-desc-publishInfo-isbn',
									fieldName: prefixName + '-isbn',
									labelWidth: 130
								},
								{
									xtype: 'form-desc-publishInfo-sequence',
									fieldName: prefixName + '-sequence'
								}
							]
						}
					]
				}
			];
			
			me.callParent(arguments);
		},

		/**
		 * Возвращает библиографическое описание.
		 * @return {FBEditor.view.form.desc.publishInfo.biblio.Biblio}
		 */
		getBiblio: function ()
		{
			var me = this,
				biblio;
			
			biblio = me._biblio || me.down('form-desc-biblio-description');
			me._biblio = biblio;
			
			return biblio;
		}
	}
);