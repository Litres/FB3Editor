/**
 * Элемент изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.img.ImgElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.img.ImgElementController',
			'FBEditor.editor.command.img.CreateCommand'
		],

		controllerClass: 'FBEditor.editor.element.img.ImgElementController',
		htmlTag: 'img',
		xmlTag: 'img',
		cls: 'el-img',
		defaultAttributes: {
			tabindex: 0
		},

		createFromRange: true,

		/**
		 * @property {FBEditor.resource.Resource} Ссылка на ресурс.
		 */
		resource: null,

		isImg: true,

		/**
		 * @private
		 * @property {String} Айди связанного ресура, который необходимо связать с изображением после его загрузки.
		 */
		loadingResId: '',

		isEmpty: function ()
		{
			return false;
		},

		clear: function ()
		{
			var me = this,
				resource = me.resource;

			if (resource)
			{
				resource.removeElement(me);
			}

			me.callParent();
		},

		getNode: function (viewportId)
		{
			var me = this,
				node;

			if (!me.linkResource())
			{
				// если нет ресурса, меняем состояние картинки
				me.setStateLoading();
			}

			node = me.callParent(arguments);

			return node;
		},

		getAttributesXml: function (withoutText)
		{
			var me = this,
				attributes = Ext.clone(me.attributes),
				attr = '';

			attributes.src = me.resource ? me.resource.name : 'undefined';
			Ext.Object.each(
				attributes,
				function (key, val)
				{
					if (withoutText && key === 'alt' || key === 'tabindex')
					{
						// пропускаем
					}
					else
					{
						attr += key + '="' + val + '" ';
					}
				}
			);

			return attr;
		},

		setStyleHtml: function ()
		{
			var me = this,
				attributes = me.attributes,
				style;

			style = me.callParent();
			style += style ? ' ' : '';
			style += attributes.width ? 'width: ' + attributes['width'] + '; ' : '';
			style += attributes['min-width'] ? 'min-width: ' + attributes['min-width'] + '; ' : '';
			style += attributes['max-width'] ? 'max-width: ' + attributes['max-width'] + '; ' : '';
			me.style = style;

			return style;
		},

		getData: function ()
		{
			var me = this,
				data,
				resData;

			data = me.callParent(arguments);
			resData = {
				name: me.resource ? me.resource.name : null
			};
			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					resData[key] = val ? val : '';
				}
			);
			resData.src = me.attributes.src ? me.attributes.src : 'undefined';
			data = Ext.apply(data, resData);

			return data;
		},

		update: function (data)
		{
			var me = this;

			//  удаляем ссылку на старый ресурс
			if (me.resource)
			{
				me.resource.removeElement(me);
				me.resource = null;
			}
			
			me.stateLoading = false;

			// аттрибуты
			me.attributes = Ext.clone(me.defaultAttributes);

			Ext.Object.each(
				data,
			    function (key, val)
			    {
				    if (val)
				    {
					    me.attributes[key] = val;
				    }
			    }
			);

			// отображение
			me.callParent(arguments);
		},

		getNameTree: function ()
		{
			var me = this,
				name;

			name = me.callParent(arguments);

			if (me.resource)
			{
				name += ' ' + me.resource.name;
			}

			return name;
		},

		getOnlyStylesChildren: function (fragment)
		{
			var me = this;

			// признак скопированного изображения
			if (me.attributes.src.substring(0, 1) === '#')
			{
				// изменяем путь к изображению
				me.attributes.src = me.attributes.src.substring(1);
			}

			fragment.add(me);
		},

		beforeCopy: function ()
		{
			var me = this;

			if (me.resource)
			{
				me.updateSrc('#' + me.resource.name);
				//console.log('before copy img', me.resource.name);
			}
		},

		afterCopy: function ()
		{
			var me = this;

			if (me.resource)
			{
				me.updateSrc(me.attributes.src);
				//console.log('after copy img');

			}
		},

		/**
		 * Удаляет связь изображения с ресурсом.
		 */
		deleteLinkResource: function (src)
		{
			var me = this,
				resource = me.resource;

			if (resource)
			{
				resource.removeElement(me);
			}
			me.resource = null;

			me.attributes.src = src || 'undefined';
			me.updateSrc(me.attributes.src);
		},

		/**
		 * Соответствует ли переданный айди ожидаемому ресурсу.
		 * @param {String} resId Айди ресурса.
		 * @return {Boolean}
		 */
		isLoadingRes: function (resId)
		{
			var me = this;

			return me.loadingResId === resId;
		},

		/**
		 * @private
		 * Связывает изображение с ресурсом.
		 * @return {FBEditor.resource.Resource} Ресурс.
		 */
		linkResource: function ()
		{
			var me = this,
				attributes = me.attributes,
				manager = FBEditor.resource.Manager,
				resource;

			attributes.src = attributes.src || 'undefined';
			resource = manager.getResourceByFileId(attributes.src) || manager.getResourceByName(attributes.src);

			if (resource)
			{
				attributes.src = resource.url;
				resource.addElement(me);
				me.resource = resource;
			}

			return resource;
		},

		/**
		 * @private
		 * Обновляет путь изображения.
		 * @param {String} src Путь.
		 */
		updateSrc: function (src)
		{
			var me = this,
				manager = me.getManager();

			manager.setSuspendEvent(true);

			Ext.Object.each(
				me.nodes,
				function (key, node)
				{
					node.setAttribute('src', src);
				}
			);

			manager.setSuspendEvent(false);
		},

		/**
		 * @private
		 * Устанавливает элемент в режим ожидания загрузки ресурса.
		 */
		setStateLoading: function ()
		{
			var me = this;

			// сохраняем айди ресурса
			me.loadingResId = me.attributes.src;

			// изображение крутилки
			me.attributes.src = Ext.manifest.output ? Ext.manifest.output.base + '/' : '';
			me.attributes.src += 'resources/images/loadmask/loading.gif';
		}
	}
);