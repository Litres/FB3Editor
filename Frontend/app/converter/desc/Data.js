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
			d = me.convertWritten(d);
			d = me.convertDocumentInfo(d);

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
			d['document-info-ocr'] = d['document-info'].ocr;
			d['document-info-editor'] = d['document-info'].editor;
			delete d['document-info'];

			return d;
		}
	}
);