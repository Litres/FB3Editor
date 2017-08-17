/**
 * Утилита для работы с буфером обмена.
 *
 * @singleton
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.util.ClipboardData',
	{
		/**
		 * @private
		 * @property {Object} Объект события вставки.
		 */
		evt: null,

		/**
		 * @private
		 * @property {Object[]} Данные изображений из RTF.
		 */
		imagesFromRtf: null,

		constructor: function (evt)
		{
			var me = this;

			me.evt = evt;
		},

		/**
		 * Устанавливает в буфер строку html.
		 * @param {String} html
		 */
		setHtml: function (html)
		{
			var me = this,
				e = me.evt,
				data = e.clipboardData;

			data.setData('text/html', html);
		},

		/**
		 * Парсит RTF из буфера и возврщает список изображений.
		 * @return {Object[]} Список изображений.
		 */
		getImagesFromRtf: function ()
		{
			var me = this,
				e = me.evt,
				data = e.clipboardData,
				images = me.imagesFromRtf,
				rtf,
				imageData,
				imageHref,
				href,
				res,
				reg,
				type,
				bytes,
				blob;

			if (!images)
			{
				rtf = data.getData('text/rtf');
				//console.log('RTF', rtf);

				if (rtf)
				{
					rtf = rtf.replace(/[\n\s]+/g, '');

					// удлаяем мусорную командную последовательность
					rtf = rtf.replace(/\\hich\\af37\\dbch\\af37\\loch\\f37/g, '');

					// получаем связи для изображений из html
					imageHref = me.getImageHrefFromHtml();

					//console.log('imageHref', imageHref);

					if (imageHref)
					{
						reg = /\{\\field.*?includepicture"(.*?)".*?\{\\pict.*?([0-9a-f]{100,})\}/ig;

						while (res = reg.exec(rtf))
						{
							// делаем нормальные слешы
							href = res[1].replace(/\\{4}/g, '/');

							// вырезаем лишние управляющие коды между точкой и расширением
							//href = href.replace(/\..*?(jpeg|jpg|png|gif|svg)$/ig, '.$1');

							//console.log('href', href, res);

							imageData = imageHref[href];

							if (imageData)
							{
								// получаем данные ресурса

								type = FBEditor.util.Format.getMimeType(imageData.src);
								bytes = FBEditor.util.Format.hexToBytes(res[2]);
								blob = new Blob([bytes], {type: type});

								images = images || [];
								images.push(
									{
										src: imageData.src,
										blob: blob
									}
								);
							}
						}
					}
				}

				//console.log('images', images);
			}

			me.imagesFromRtf = images;

			return images;
		},

		/**
		 * Возвращает список связей для изображений.
		 * Используется при вставке из Word.
		 * @return {Object}
		 */
		getImageHrefFromHtml: function ()
		{
			var me = this,
				e = me.evt,
				data = e.clipboardData,
				images = null,
				html,
				reg,
				reg2,
				res,
				res2,
				shapes,
				src,
				href,
				dataSrc;

			html = data.getData('text/html');
			html = html.replace(/[\n\s]+/g, '');

			// получаем ссылки на изображения
			reg = /<img.*?src="(.*?)".*?shapes="(.*?)"/ig;

			while (res = reg.exec(html))
			{
				//console.log('res', res);

				// сслыка на изображение
				src = res[1];

				// ссылка на форму данных
				shapes = res[2];

				// получаем связи на данные изображения
				reg2 = new RegExp('shape+id="' + shapes + '".*?imagedata+src="(.*?)"+.*?href="file:[/]{3}(.*?)"', 'i');
				res2 = html.match(reg2);
				dataSrc = res2[1];
				href = res2[2];

				//console.log('res2', res2);

				images = images || {};
				images[href] = {
					dataSrc: dataSrc,
					src: src,
					href: href
				};
			}

			return images;
		}
	}
);