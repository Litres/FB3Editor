/**
 * Схема XSD для элемента описания - history.
 *
 * @author dew1983@mail.ru	<Suvorov Andrey M.>\
 */

Ext.define(
	'FBEditor.xsd.desc.History',
	{
		/**
		 * Вовзращает xsd.
		 * @return {String} Строка xsd.
		 */
		getXsd: function ()
		{
			var xsd;

			xsd = '\
<?xml version="1.0" encoding="UTF-8"?>\
<schema xmlns="http://www.w3.org/2001/XMLSchema" xmlns:fb3d="http://www.fictionbook.org/FictionBook3/description" \
targetNamespace="http://www.fictionbook.org/FictionBook3/description" elementFormDefault="qualified" \
attributeFormDefault="unqualified">\
	<element name="history">\
		<complexType>\
			<sequence>\
				<element name="p" type="fb3d:BasicTextType"/>\
				<choice minOccurs="0" maxOccurs="unbounded">\
					<element name="p" type="fb3d:BasicTextType"/>\
					<element name="br"/>\
				</choice>\
			</sequence>\
		</complexType>\
	</element>\
	<complexType name="BasicTextType" mixed="true">\
		<choice minOccurs="0" maxOccurs="unbounded">\
			<element name="strong" type="fb3d:BasicTextType"/>\
			<element name="em" type="fb3d:BasicTextType"/>\
			<element name="a">\
				<complexType mixed="true">\
					<complexContent mixed="true">\
						<extension base="fb3d:BasicTextType">\
							<attribute name="href" type="anyURI" use="required"/>\
						</extension>\
					</complexContent>\
				</complexType>\
			</element>\
		</choice>\
	</complexType>\
</schema>\
			';

			return xsd;
		}
	}
);