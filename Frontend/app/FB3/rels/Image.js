/**
 * Изображение архива FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Image',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		mixins: {
			resData: 'FBEditor.resource.data.ZipData'
		},

		/**
		 * @property {Boolean} Обложка ли.
		 */
		isCover: false,

		/**
		 * @property {String} Айди изображения в архиве.
		 */
		id: null,

        /**
		 * Возвращает данные.
		 * @resolve {Object}
         * @return {Promise}
         */
		getData: function ()
		{
			var me = this;
			
			return me.mixins.resData.getData.call(me);
		},

		getRels: function ()
		{
            return Promise.resolve(null);
		},

		/**
		 * Обложка ли.
		 * @return {Boolean}
		 */
		getIsCover: function ()
		{
			return this.isCover;
		},

		/**
		 * Возвращает айди.
		 * @return {String}
		 */
		getId: function ()
		{
			return this.id;
		},

		/**
		 * Устанавливает айди.
		 * @param {String} id
		 */
		setId: function (id)
		{
			this.id = id;
		}
	}
);