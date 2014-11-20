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
				d;

			d = me.normalize(data);
			d = me.convertPeriodical(d);
			d = me.convertTitle(d);
			d = me.convertSequence(d);
			d = me.convertClassification(d);
			d = me.convertWritten(d);
			d = me.convertDocumentInfo(d);

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
			var d = data;

			d['title-main'] = d.title.main;
			d['title-sub'] = d.title.sub ? d.title.sub : '';
			d['title-alt'] = d.title.alt ? d.title.alt : '';
			delete d.title;

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля sequence.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertSequence: function (data)
		{
			var d = data;

			/*if (d.sequence)
			{
				d['sequence-id'] = d.sequence.id;
				d['sequence-number'] = d.sequence.number ? d.sequence.number : '';
				d['sequence-title-main'] = d.sequence.title.main;
				d['sequence-title-sub'] = d.sequence.title.sub ? d.sequence.title.sub : '';
				d['sequence-title-alt'] = d.sequence.title.alt ? d.sequence.title.alt : '';
				delete d.sequence;
			}*/
			d.sequence = d.sequence ? d.sequence : '';
			d.sequence = d.sequence.id ? [d.sequence] : d.sequence;

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
			var d = data;

			d['classification-class-contents'] = d['fb3-classification'].class.contents;
			d['classification-class-text'] = d['fb3-classification'].class.text;
			d['classification-subject'] = d['fb3-classification'].subject;
			d['classification-custom-subject'] = d['fb3-classification']['custom-subject'] ?
			                                     d['fb3-classification']['custom-subject'] : '';
			d['classification-udk'] = d['fb3-classification'].udk ? d['fb3-classification'].udk : '';
			d['classification-bbk'] = d['fb3-classification'].bbk ? d['fb3-classification'].bbk : '';
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
			if (d['fb3-classification'].coverage)
			{
				d['classification-coverage-text'] = d['fb3-classification'].coverage.text ?
				                                    d['fb3-classification'].coverage.text : '';
				d['classification-coverage-country'] = d['fb3-classification'].coverage.country ?
				                                       d['fb3-classification'].coverage.country : '';
				d['classification-coverage-place'] = d['fb3-classification'].coverage.place ?
				                                     d['fb3-classification'].coverage.place : '';
				d['classification-coverage-date'] = d['fb3-classification'].coverage.date ?
				                                    d['fb3-classification'].coverage.date : '';
				d['classification-coverage-age'] = d['fb3-classification'].coverage.age ?
				                                   d['fb3-classification'].coverage.age : '';
				d['classification-coverage-date-from'] = d['fb3-classification'].coverage['date-from'] ?
				                                         d['fb3-classification'].coverage['date-from'] : '';
				d['classification-coverage-date-to'] = d['fb3-classification'].coverage['date-to'] ?
				                                       d['fb3-classification'].coverage['date-to'] : '';
			}
			delete d['fb3-classification'];

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
				d['written-lang'] = d.written.lang;
				if (d.written.date)
				{
					d['written-date-value'] = d.written.date.value ? d.written.date.value : '';
					d['written-date-text'] = d.written.date.text ? d.written.date.text : '';
				}
				d['written-country'] = d.written.country ? d.written.country : '';
				delete d.written;
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
			var d = data;

			d['document-info-created'] = d['document-info'].created;
			d['document-info-updated'] = d['document-info'].updated;
			d['document-info-program-used'] = d['document-info']['program-used'] ?
			                                  d['document-info']['program-used'] : '';
			d['document-info-src-url'] = d['document-info']['src-url'] ?
			                                  d['document-info']['src-url'] : '';
			d['document-info-ocr'] = d['document-info'].ocr ? d['document-info'].ocr : '';
			d['document-info-editor'] = d['document-info'].editor ? d['document-info'].editor : '';
			delete d['document-info'];

			return d;
		}
	}
);