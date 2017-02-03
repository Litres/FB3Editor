/**
 * Прокси элемента изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.model.ImgProxy',
	{
		/**
		 * @private
		 * @property {FBEditor.editor.element.img.ImgElement} Вставляемое изображение.
		 */
		el: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.ModelProxy} Прокси модели.
		 */
		modelProxy: null,
		
		constructor: function (data)
		{
			var me = this;
			
			me.el = data.el;
			me.modelProxy = data.modelProxy;
		},

		/**
		 * Нормализует элемент изображения.
		 * @return {Boolean} Произошли ли изменения модели.
		 */
		normalize: function ()
		{
			var me = this,
				el = me.el,
				paste = FBEditor.resource.Manager.getPaste(),
				modelProxy = me.modelProxy,
				pasteProxy = modelProxy.pasteProxy,
				manager = pasteProxy.manager,
				schema = manager.getSchema(),
				attributes,
				src,
				blob,
				data,
				res;

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

						reg = new RegExp(pattern);

						if (!reg.test(attr))
						{
							// некорректный аттрибут

							if (/(\d+)(.\d+)?/.test(attr))
							{
								// исправляем аттрибут
								el.attributes[name] = attr.replace(/(\d+)(.\d+)?/g, '$1$2mm');
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

			if (res)
			{
				// связываем ресурс с элементом изображения
				res.addElement(el);

				// добавляем ресурс в очередь вставщика для последующего его сохранения
				paste.add(res);
			}
			else
			{
				el.attributes.src = 'undefined';
				Ext.log({level: 'warn', msg: 'Невозможно создать ресурс из буфера ' + src});
			}
			
			return true;
		}
	}
);