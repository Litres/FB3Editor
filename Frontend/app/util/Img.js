/**
 * Утилита для работы с изображениями.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.util.Img',
	{
		singleton: true,

		/**
		 * Преобразует строку base64 в данные Blob.
		 * @param {String} b64Data Данные изображения в виде base64.
		 * @param {String} [fileType] Mime-type.
		 * @param {Number} [sliceSize=512] Используется для оптимизации преобразования.
		 * @return {Blob}
		 */
		urlDataToBlob: function (b64Data, fileType, sliceSize)
		{
			var reg = /^data:(image\/.*?);base64,/i,
				byteArrays = [],
				byteCharacters,
				slice,
				byteNumbers,
				byteArray,
				blob;

			sliceSize = sliceSize || 512;
			fileType = fileType || '';
			fileType = !fileType && reg.test(b64Data) ? b64Data.match(reg)[1] : fileType;
			b64Data = reg.test(b64Data) ? b64Data.replace(reg, '') : b64Data;
			byteCharacters = atob(b64Data);

			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) 
			{
				slice = byteCharacters.slice(offset, offset + sliceSize);
				byteNumbers = new Array(slice.length);
				
				for (var i = 0; i < slice.length; i++) 
				{
					byteNumbers[i] = slice.charCodeAt(i);
				}

				byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}

			blob = new Blob(byteArrays, {type: fileType});

			return blob;
		}
	}
);