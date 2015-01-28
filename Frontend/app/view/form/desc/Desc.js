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
			'FBEditor.view.form.desc.fieldset.Sequence',
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
		//minWidth: 730,
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
					xtype: 'desc-fieldset-sequence'
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
		 * @param {Object} [values] Данные формы.
		 * @return {String} строка xml.
		 */
		getXml: function (values)
		{
			var me = this,
				xml,
				xsd,
				data;

			data = values || me.getValues();
			data = {
				'fb3-description': data
			};
			data['fb3-description']._xmlns = 'http://www.fictionbook.org/FictionBook3/description';
			data['fb3-description']._id = '';
			data['fb3-description']._version = '1.0';
			console.log('save desc', data);
			xml = FBEditor.util.xml.Json.jsonToXml(data);
			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			//console.log(xml);

			// проверка xml по схеме отложена на будущее
			/*xsd = FBEditor.xsd.Desc.getXsd();
			data = {
				xml: xml,
				xsd: xsd,
				xmlFileName: 'description.xml',
				schemaFileName: 'description.xsd'
			};
			valid = FBEditor.util.xml.Jsxml.valid(data);
			console.log('valid', valid);*/

			return xml;
		},

		/**
		 * Проверяет валидность формы.
		 * @return {Boolean} Валидна ли форма.
		 */
		isValid: function ()
		{
			var me = this,
				items = me.items,
				isValid = true;

			items.each(
				function (item)
				{
					if (item.isValid && !item.isValid())
					{
						isValid = false;
					}
				}
			);

			return isValid;
		},

		/**
		 * Возвращает данные формы  в виде объекта пригодного для преобразования в xml.
		 * @return {Object} Объект данных.
		 */
		getValues: function ()
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
		},

		/**
		 * Возвращает мета-данные в виде строки xml.
		 * @param {Object} [values] Данные формы.
		 * @return {String} Строка xml.
		 */
		getMetaXml: function (values)
		{
			var me = this,
				xml,
				data,
				rev,
				metaData;

			data = values || me.getValues();
			rev = FBEditor.file.Manager.fb3file.getStructure().getMeta().revision.__text;
			rev = Number(rev);
			rev = Ext.isNumber(rev) ? rev + 1 : 1;
			metaData = {
				coreProperties: {
					__prefix: 'cp',
					'_xmlns:cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
					'_xmlns:dc': 'http://purl.org/dc/elements/1.1/',
					'_xmlns:dcterms': 'http://purl.org/dc/terms/',
					'_xmlns:dcmitype': 'http://purl.org/dc/dcmitype/',
					'dc:title': data.title.main,
					'dc:creator': data['fb3-relations'].subject[0].title ?
					              data['fb3-relations'].subject[0].title.main :
					              data['fb3-relations'].subject[0]['last-name'],
					'cp:revision': rev,
					'cp:contentStatus': data['fb3-classification'].class._contents,
					'cp:category': data['fb3-classification'].class.__text,
					'dcterms:modified': data['document-info']._updated,
					'dcterms:created': data['document-info']._created
				}
			};
			if (data.title && data.title.sub)
			{
				metaData.coreProperties['dc:subject'] = data.title.sub;
			}
			if (data.anotation)
			{
				metaData.coreProperties['dc:description'] = Ext.util.Format.stripTags(data.anotation);
			}
			console.log('save meta', metaData);
			xml = FBEditor.util.xml.Json.jsonToXml(metaData);
			xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + xml;
			//console.log(xml);

			return xml;
		}
	}
);