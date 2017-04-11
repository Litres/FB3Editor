/**
 * Прокси элемента изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.model.ImgProxy',
	{
		extend: 'FBEditor.editor.pasteproxy.model.AbstractProxy',

		normalize: function ()
		{
			var me = this,
				el = me.el,
				paste = FBEditor.resource.Manager.getPaste(),
				modelProxy = me.modelProxy,
				pasteProxy = modelProxy.pasteProxy,
				src,
				blob,
				data,
				image,
				res;

			if (el.normalized)
			{
				// элемент уже нормализован
				return false;
			}

			el.normalized = true;


			// нормализуем аттрибуты
			me.normalizeAttributes();

			src = el.attributes.src;

			if (/^data:(image\/.*?);base64,/i.test(src))
			{
				// получаем данные для ресурса из атрибута src
				blob = FBEditor.util.Img.urlDataToBlob(src);
				data = Ext.create('FBEditor.resource.data.PasteData', {blob: blob});
				res = Ext.create('FBEditor.resource.Resource', data.getData());
			}

			if (/^(http|https):/i.test(src))
			{
				// создаем внешний ресурс
				data = Ext.create('FBEditor.resource.data.ExternalData', {url: src});
				res = Ext.create('FBEditor.resource.ExternalResource', data.getData());
			}

			if (/^file:/i.test(src))
			{
				// создаем ресурс из RTF (для Word)

				// получаем данные изображения из буфера формата RTF
				image = pasteProxy.getImageFromRtf(src);

				//console.log('file', src, image);
				
				if (image)
				{
					data = Ext.create('FBEditor.resource.data.PasteData', {blob: image.blob});
					res = Ext.create('FBEditor.resource.Resource', data.getData());
				}
			}

			if (res)
			{
				console.log('add el', el);
				
				// связываем ресурс с элементом изображения
				res.addElement(el);

				// добавляем ресурс в очередь вставщика для последующего его сохранения
				paste.add(res);

				if (!el.parent.isStyleType)
				{
					// помещаем изображение в абзац, если оно находится не в стилевом элементе или абзаце
					me.moveElsToNewHolder(el);
				}
			}
			else
			{
				el.attributes.src = 'undefined';
				Ext.log({level: 'warn', msg: 'Невозможно создать ресурс из буфера ' + src});
			}
			
			return true;
		},

		/**
		 * Нормализует аттрибуты элемента.
		 */
		normalizeAttributes: function ()
		{
			var me = this,
				el = me.el,
				modelProxy = me.modelProxy,
				pasteProxy = modelProxy.pasteProxy,
				manager = pasteProxy.manager,
				schema = manager.getSchema(),
				attributes;

			// получаем все разрешенные аттрибуты
			attributes = schema.getAttributes('img');

			// нормализуем аттрибуты
			Ext.Object.each(
				attributes,
				function (name, item)
				{
					var pattern,
						attr,
						reg;

					if (/width/i.test(name) && el.attributes[name])
					{
						// нормализуем ширину

						attr = el.attributes[name];
						pattern = item.type.pattern;

						// исправляем паттерн
						pattern = pattern.replace(/d\+/g, '\\d+');

						reg = new RegExp(pattern);

						if (!reg.test(attr))
						{
							// некорректный аттрибут

							if (/(\d+)(.\d+)?/.test(attr))
							{
								// исправляем аттрибут

								attr = FBEditor.util.Format.pixelsToMillimeters(attr);

								if (Ext.isNumber(attr))
								{
									el.attributes[name] = attr.toFixed(2) + 'mm';
								}
								else
								{
									// удаляем аттрибут
									delete el.attributes[name];
								}
							}
							else
							{
								// удаляем аттрибут
								delete el.attributes[name];
							}
						}
					}
				}
			);
		}
	}
);