/**
 * Менеджер путей.
 * Работает с хэшем в URL.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.route.Manager',
	{
		singleton: true,

		/**
		 * @property {Object} Параметры, переданные в хэше url.
		 */
		params: {},

		init: function ()
		{
			var me = this,
				params,
				hash;

			hash = location.hash.substring(1);
			//console.log('hash', escape(hash));

			if (hash)
			{
				params = hash.split('&');

				Ext.Array.each(
					params,
					function (item)
					{
						var res,
							name,
							val;

						res = item.split('=');
						name = res[0];
						val = res[1] ? unescape(res[1]) : null;
						me.params[name] = val;
					}
				);
			}

			//console.log('url params', me.params);
		},

		/**
		 * Возвращает параметры.
		 * @return {Object}
		 */
		getParams: function ()
		{
			return this.params;
		},

		/**
		 * Устанавливает параметр.
		 * @param {String} name Имя парамтера.
		 * @param {*} val Значение.
		 */
		setParam: function (name, val)
		{
			var me = this;

			me.param[name] = val;
		},
		
		/**
		 * Возвращает параметр с заданным именем.
		 * @param {String} name Имя параметра.
		 * @return {String|null|undefined} Значение параметра.
		 */
		getParam: function (name)
		{
			var me = this,
				params = me.getParams();
			
			return params[name];
		},
		
		/**
		 * Существует ли параметр с заданным именем.
		 * @param {String} name Имя параметра.
		 * @returns {Boolean}
		 */
		isSetParam: function (name)
		{
			var me = this,
				param = me.getParam(name),
				isSet;
			
			isSet = param !== undefined;
			
			return isSet;
		},

		/**
		 * Удаляет параметры.
		 * @param {Array|String} name Имя параметра или список из нескольких имён.
		 */
		removeParams: function (name)
		{
			var me = this,
				hash,
				names,
				reg;

			names = Ext.isArray(name) ? name : [name];

			Ext.Array.each(
				names,
				function (item)
				{
					if (me.params[item] !== undefined)
					{
						// удаляем из хэша
						hash = location.hash.substring(1);
						reg = new RegExp(item + '=[^&]+', 'ig');
						hash = hash.replace(reg, '');
						hash = hash.replace('&&', '&');
						hash = hash.replace(/^&|&$/ig, '');
						location.hash = hash;

						delete me.params[item];
					}
				}
			);
		},
		
		/**
		 * Возвращает общее количество параметров в URL.
		 * @return {Number}
		 */
		getCountParams: function ()
		{
			var me = this,
				params = me.getParams(),
				count;
			
			count = Ext.Object.getSize(params);
			
			return count;
		},
		
		/**
		 * устанавливает параметр в URL.
		 * @param {String} name Имя параметра.
		 * @param {String} [value] Значение параметра.
		 */
		setParamToURL: function (name, value)
		{
			var me = this,
				paramURL,
				count;
			
			// предварительно удаляем параметр из URL, если он уже существует
			me.removeParams(name);
			
			count = me.getCountParams();
			
			// формируем параметр для URL
			value = value !== undefined ? '=' + value : '';
			paramURL = name + value;
			paramURL = count ? '&' + paramURL : '#' + paramURL;
			
			// добавляем в URL
			location.href += paramURL;
		}
	}
);