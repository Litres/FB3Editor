/**
 * Конвертер данных описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.converter.desc.Data',
	{
		extend: 'FBEditor.converter.AbstractConverter',
		singleton: true,

		toForm: function (data)
		{
			var me = this,
				xml = data.xml,
				annotation,
				preamble,
				history,
				d;


			// преобразуем данные для полей на основе htmleditor
			xml = xml.replace(/[\n\r\t]/g, '');
			annotation = xml.match(/<annotation>(.*?)<\/annotation>/);
			data.annotation = annotation ? annotation[1] : '';
			preamble = xml.match(/<preamble>(.*?)<\/preamble>/);
			data.preamble = preamble ? preamble[1] : '';
			history = xml.match(/<history>(.*?)<\/history>/);
			data.history = history ? history[1] : '';

			d = me.normalize(data);
			d = me.convertPeriodical(d);
			d = me.convertTitle(d);
			d = me.convertRelations(d);
			d = me.convertClassification(d);
			d = me.convertWritten(d);
			d = me.convertDocumentInfo(d);
			d = me.convertPublishInfo(d);
			d = me.convertCustomInfo(d);

			d.lang = d.lang ? d.lang : 'ru';

			delete d.xml;

			//console.log('open desc', d);

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля periodical.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertPeriodical: function (data)
		{
			var d = data;

			if (d.periodical)
			{
				d['periodical-id'] = d.periodical.id;
				d['periodical-number'] = d.periodical.number.number;
				d['periodical-year'] = d.periodical.number.year;
				d['periodical-date'] = d.periodical.number.date ? d.periodical.number.date : '';
				d['periodical-text'] = d.periodical.number.text ? d.periodical.number.text : '';
				d['periodical-issn'] = d.periodical.issn ? d.periodical.issn : '';
				if (d.periodical.title)
				{
					d['periodical-title-main'] = d.periodical.title.main;
					d['periodical-title-sub'] = d.periodical.title.sub ? d.periodical.title.sub : '';
					d['periodical-title-alt'] = d.periodical.title.alt ? d.periodical.title.alt : '';
				}
				delete d.periodical;
			}

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля title.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertTitle: function (data)
		{
			var me = this,
				d = data;

			if (d.title)
			{
				d['title-main'] = d.title.main ? d.title.main : '';
				d['title-sub'] = d.title.sub ? d.title.sub : '';
				d['title-alt'] = Ext.isString(d.title.alt) ? {0: d.title.alt} : d.title.alt;
				delete d.title;
			}

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля relations.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertRelations: function (data)
		{
			var me = this,
				d = data;

			if (d['fb3-relations'])
			{
				d.relations = {
					'relations-subject': d['fb3-relations'].subject ? d['fb3-relations'].subject : '',
					'relations-object': d['fb3-relations'].object ? d['fb3-relations'].object : ''
				};
				d.relations['relations-subject'] = me._convertPropertyName(d.relations['relations-subject'],
				                                                           'relations-subject');
				d.relations['relations-object'] = me._convertPropertyName(d.relations['relations-object'],
				                                                          'relations-object');

				Ext.Object.each(
					d.relations['relations-subject'],
					function (index, item)
					{
						// конвертируем данные для типа связи
						item['relations-subject-link-radio-' + index] = {};
						item['relations-subject-link-radio-' + index]['rel-subject-link-' + index] =
							item['relations-subject-link'];

						if (item['relations-subject-link'] !== 'author' &&
						    item['relations-subject-link'] !== 'translator'&&
						    item['relations-subject-link'] !== 'publisher')
						{
							item['relations-subject-link-list'] = item['relations-subject-link'];
							item['relations-subject-link-radio-' + index]['rel-subject-link-' + index] = 'other-list';
						}
						delete item['relations-subject-link'];
					}
				);
				delete d['fb3-relations'];
			}


			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля classification.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertClassification: function (data)
		{
			var me = this,
				d = data;

			if (d['fb3-classification'])
			{
				if (d['fb3-classification']['class'])
				{
					d['classification-class-contents'] = d['fb3-classification']['class'].contents ?
					                                     d['fb3-classification']['class'].contents : '';
					d['classification-class-text'] = d['fb3-classification']['class'].text ?
					                                 d['fb3-classification']['class'].text : '';
				}
				d['classification-subject'] = me._convertValToObj(d['fb3-classification'].subject,
				                                                  'classification-subject');
				/*d['classification-custom-subject'] = d['fb3-classification']['custom-subject'] ?
				 d['fb3-classification']['custom-subject'] : '';*/
				d['classification-udc'] = me._convertValToObj(d['fb3-classification'].udc, 'classification-udc');
				d['classification-bbk'] = me._convertValToObj(d['fb3-classification'].bbk, 'classification-bbk');
				if (d['fb3-classification']['target-audience'])
				{
					d['classification-target-audience-text'] = d['fb3-classification']['target-audience'].text ?
					                                           d['fb3-classification']['target-audience'].text : '';
					d['classification-target-audience-education'] =
						d['fb3-classification']['target-audience'].education ?
						d['fb3-classification']['target-audience'].education : '';
					d['classification-target-audience-age-min'] =
						d['fb3-classification']['target-audience']['age-min'] ?
						d['fb3-classification']['target-audience']['age-min'] : '';
					d['classification-target-audience-age-max'] =
						d['fb3-classification']['target-audience']['age-max'] ?
						d['fb3-classification']['target-audience']['age-max'] : '';
				}
				if (d['fb3-classification'].setting)
				{
					d['classification-setting-text'] = d['fb3-classification'].setting.text ?
					                                   d['fb3-classification'].setting.text : '';
					d['classification-setting-country'] = d['fb3-classification'].setting.country ?
					                                      d['fb3-classification'].setting.country : '';
					d['classification-setting-place'] = d['fb3-classification'].setting.place ?
					                                    d['fb3-classification'].setting.place : '';
					d['classification-setting-date'] = d['fb3-classification'].setting.date ?
					                                   d['fb3-classification'].setting.date : '';
					d['classification-setting-age'] = d['fb3-classification'].setting.age ?
					                                  d['fb3-classification'].setting.age : '';
					d['classification-setting-date-from'] = d['fb3-classification'].setting['date-from'] ?
					                                        d['fb3-classification'].setting['date-from'] : '';
					d['classification-setting-date-to'] = d['fb3-classification'].setting['date-to'] ?
					                                      d['fb3-classification'].setting['date-to'] : '';
				}
				delete d['fb3-classification'];
			}

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля written.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertWritten: function (data)
		{
			var d = data;

			if (d.written)
			{
				d['written-lang'] = d.written.lang ? d.written.lang : '';
				if (d.written.date)
				{
					d['written-date-value'] = d.written.date.value ? d.written.date.value : '';
					d['written-date-text'] = d.written.date.text ? d.written.date.text : '';
				}
				if (d.written['date-public'])
				{
					d['written-date-public-value'] = d.written['date-public'].value ? d.written.date.value : '';
					d['written-date-public-text'] = d.written['date-public'].text ? d.written.date.text : '';
				}
				d['written-country'] = d.written.country ? d.written.country : '';
				d['written-date-translation'] = d.written['date-translation'] ? d.written['date-translation'] : '';
				delete d.written;
			}

			if (d.translated)
			{
				d['translated-value'] = d.translated.value ? d.translated.value : '';
				d['translated-text'] = d.translated.text ? d.translated.text : '';
				delete d.translated;
			}

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля document-info.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertDocumentInfo: function (data)
		{
			var me = this,
				d = data,
				dateTime;

			if (d['document-info'])
			{
				if (d['document-info'].isbn)
				{
					d['document-info-isbn'] = d['document-info'].isbn[0] ?
					                          d['document-info'].isbn : {0: d['document-info'].isbn};
				}

				dateTime = Ext.Date.format(new Date(), 'Y-m-d') + 'T' + Ext.Date.format(new Date(), 'H:i:s');
				d['document-info'].created = d['document-info'].created ? d['document-info'].created : dateTime;
				d['document-info'].updated = d['document-info'].updated ? d['document-info'].updated : dateTime;

				d['document-info-created-date'] = d['document-info'].created.split('T')[0];
				d['document-info-created-time'] = d['document-info'].created.split('T')[1];
				d['document-info-updated-date'] = d['document-info'].updated.split('T')[0];
				d['document-info-updated-time'] = d['document-info'].updated.split('T')[1];
				d['document-info-program-used'] = d['document-info']['program-used'] ?
				                                  d['document-info']['program-used'] : '';
				d['document-info-src-url'] = d['document-info']['src-url'] ?
				                             d['document-info']['src-url'] : '';
				d['document-info-ocr'] = d['document-info'].ocr ? d['document-info'].ocr : '';
				d['document-info-editor'] = d['document-info'].editor ? d['document-info'].editor : '';
				delete d['document-info'];
			}

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля paper-publish-info.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertPublishInfo: function (data)
		{
			var me = this,
				d = data,
				xml = d.xml,
				biblio;

			// преобразуем поле библиографического описания
			biblio = xml.match(/<biblio-description>(.*?)<\/biblio-description>/g);

			if (biblio)
			{
				d['paper-publish-info'] = d['paper-publish-info'][0] ?
				                          d['paper-publish-info'] : {0: d['paper-publish-info']};

				Ext.Object.each(
					d['paper-publish-info'],
				    function (i, item)
				    {
					    var b;

					    if (item['biblio-description'])
					    {
						    b = biblio.shift();
						    item['biblio-description'] = b.replace(/<\/?biblio-description>/g, '');
					    }
				    }
				);
			}

			d['paper-publish-info'] = me._convertPropertyName(d['paper-publish-info'], 'paper-publish-info');

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля custom-info.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertCustomInfo: function (data)
		{
			var me = this,
				d = data;

			d['custom-info'] = me._convertPropertyName(d['custom-info'], 'custom-info');

			return d;
		},

		/**
		 * @private
		 * Преобразует названия свойств в объекте данных.
		 * @param {Object} data Объект данных.
		 * @param {String} propertyName Название объекта данных.
		 * @return {Object} Преобразованный объект данных.
		 */
		_convertPropertyName: function (data, propertyName)
		{
			var d = data,
				name = propertyName;

			d = d ? d : '';
			d = d['0'] ? d : {'0': d};
			Ext.Object.each(
				d,
				function (index, item)
				{
					Ext.Object.each(
						item,
						function (key, val)
						{
							if (Ext.isObject(val) && !val['0'])
							{
								Ext.Object.each(
									val,
									function (k, v)
									{
										d[index][name + '-' + key + '-' + k] = v;
									}
								);
							}
							else
							{
								d[index][name + '-' + key] = val;
							}
							delete d[index][key];
						}
					);
				}
			);

			return d;
		},

		/**
		 * @private
		 * Преобразует данные объекта, заменяя все значения в объекте на поименнованные значения.
		 * @param {Object} data Объект данных (псевдомассив в виде объекта).
		 * @param {String} propertyName Название поименнованых значений.
		 * @return {Object} Преобразованный объект данных.
		 */
		_convertValToObj: function (data, propertyName)
		{
			var d = data,
				name = propertyName,
				newData;

			d = d ? (Ext.isString(d) ? [d] : d) : '';
			newData = d ? {} : '';
			Ext.Object.each(
				d,
				function (index, value)
				{
					newData[index]= {};
					newData[index][name] = value;
				}
			);

			return newData;
		}
	}
);