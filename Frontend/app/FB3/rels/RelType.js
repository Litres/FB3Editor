/**
 * Типы связей.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.RelType',
	{
		singleton: true,

		book: 'http://www.fictionbook.org/FictionBook3/relationships/Book',
		body: 'http://www.fictionbook.org/FictionBook3/relationships/body',
		image: 'http://www.fictionbook.org/FictionBook3/relationships/image',
		coreProperties: 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties',
		thumbnail: 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail',
		digitalSignature: 'http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/signature',
		digitalSignatureCertificate: 'http://schemas.openxmlformats.org/package/2006/relationships/' +
		                             'digital-signature/certificate',
		digitalSignatureOrigin: 'http://schemas.openxmlformats.org/package/2006/relationships/digital-signature/origin'
	}
);