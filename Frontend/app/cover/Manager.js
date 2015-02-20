/**
 * Менеджер обложки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.cover.Manager',
	{
		singleton: true,
		requires: [
			'FBEditor.cover.Cover'
		],

		/**
		 * @property {FBEditor.cover.Cover} Обложка.
		 */
		data: null,

		/**
		 * Загружает данные обложки в редактор.
		 * @param {FBEditor.FB3.rels.Thumb} thumb Обложка, полученная из архива книги.
		 */
		load: function (thumb)
		{
			var me = this,
				data;

			data = {
				content: thumb.getArrayBuffer(),
				url: thumb.getUrl(),
				baseName: thumb.getBaseFileName(),
				rootName: thumb.getFileName(),
				modifiedDate: thumb.getDate(),
				sizeBytes: thumb.getSize(),
				type: thumb.getType()
			};
			me.data = Ext.create('FBEditor.cover.Cover', data);
			me.updateCover();
		},

		/**
		 * Обновляет отображение обложки.
		 */
		updateCover: function ()
		{
			var me = this;

			Ext.getCmp('panel-cover').fireEvent('load', me.data);
		}
	}
);