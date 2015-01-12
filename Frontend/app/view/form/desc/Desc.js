/**
 * Форма описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.Desc',
	{
		extend: 'Ext.form.Panel',
		requires: [
			'Ext.ux.FieldReplicator',
			'FBEditor.ux.FieldContainerReplicator',
			'FBEditor.view.field.country.Country',
			'FBEditor.view.field.lang.Lang',
			'FBEditor.view.field.datetime.Datetime',
			'FBEditor.view.field.textfieldclear.TextFieldClear',
			'FBEditor.view.form.desc.DescController',
			'FBEditor.view.form.desc.AbstractFieldContainer',
			'FBEditor.view.form.desc.fieldset.AbstractFieldsetInner',
			'FBEditor.view.form.desc.fieldset.Title',
			'FBEditor.view.form.desc.fieldset.annotation.Annotation',
			'FBEditor.view.form.desc.fieldset.periodical.Periodical',
			'FBEditor.view.form.desc.fieldset.Classification',
			'FBEditor.view.form.desc.fieldset.RelationsSubject',
			'FBEditor.view.form.desc.fieldset.RelationsObject',
			'FBEditor.view.form.desc.fieldset.history.History',
			'FBEditor.view.form.desc.fieldset.CustomInfo',
			'FBEditor.view.form.desc.fieldset.PublishInfo',
			'FBEditor.view.form.desc.fieldset.DocumentInfo'
		],
		id: 'form-desc',
		xtype: 'form-desc',
		controller: 'form.desc',
		autoScroll: true,
		layout: {
			type: 'anchor'
		},
		minWidth: 870,
		bodyPadding: 0,
		cls: 'form-desc',
		listeners: {
			loadDesc: 'onLoadData',
			reset: 'onReset'
		},

		/**
		 * @private
		 * @property {Number} Позиция вертикального скрола до изменения размеров.
		 */
		_oldScrollY: 0,

		beforeLayout: function ()
		{
			var me = this;

			me._oldScrollY = me.getScrollY();
			me.callParent(arguments);
		},

		afterLayout: function ()
		{
			var me = this;

			me.callParent(arguments);

			// исправляем баг с перемоткой скрола
			me.setScrollY(me._oldScrollY);
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldset-title'
				},
				{
					xtype: 'desc-fieldset-annotation'
				},
				{
					xtype: 'desc-fieldset-classification'
				},
				{
					xtype: 'desc-fieldset-relations-subject'
				},
				{
					xtype: 'desc-fieldset-periodical'
				},
				{
					xtype: 'desc-fieldset-relations-object'
				},
				{
					xtype: 'desc-fieldset-publishInfo'
				},
				{
					xtype: 'desc-fieldset-history'
				},
				{
					xtype: 'desc-fieldset-customInfo'
				},
				{
					xtype: 'desc-fieldset-documentInfo'
				}
			];
			me.callParent(arguments);
		},

		/**
		 * Возвращает данные в виде строки xml.
		 * @return {String} строка xml.
		 */
		getXml: function ()
		{
			var me = this,
				xml,
				data,
				isValid;

			isValid = me.valid();
			console.log('is valid', isValid);
			data = me.values();
			console.log('data', data);
			data = {
				'fb3-description': {
					title: data.title,
					'fb3-relations': [
						{
							subject: {
								_id: '0dad1004-1430-102c-96f3-af3a14b75ca4',
								_link: 'author',
								title: {
									main: ''
								},
								'last-name': ''
							}
						}
					],
					'fb3-classification': {
						class: {
							_contents: 'part',
							__text: 'manual'
						},
						subject: 'sci_biology'
					},
					lang: 'ru',
					'document-info': {
						_created: '2008-12-05T15:10:00',
						_updated: '2008-12-05T19:56:00'
					}
				}
			};
			data['fb3-description']._xmlns = 'http://www.fictionbook.org/FictionBook3/description';
			data['fb3-description']._id = '';
			data['fb3-description']._version = '1.0';
			console.log('desc data', data);
			xml = FBEditor.util.xml.Json.jsonToXml(data);
			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			console.log(xml);

			return xml;
		},

		/**
		 * Проверяет валидность формы.
		 * @return {Boolean} Валидна ли форма.
		 */
		valid: function ()
		{
			var me = this;

			return me.isValid();
		},

		/**
		 * Возвращает данные формы  в виде объекта пригодного для преобразования в xml.
		 * @return {Object} Объект данных.
		 */
		values: function ()
		{
			var me = this,
				items = me.items,
				data = {};

			items.each(
				function (item)
				{
					if (item.getValues)
					{
						data = item.getValues(data);
					}
				}
			);

			return data;
		}
	}
);