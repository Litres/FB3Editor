/**
 * Абстрактная схема XSD для элемента описания типа AnnotationType.
 *
 * @author dew1983@mail.ru	<Suvorov Andrey M.>\
 */

Ext.define(
	'FBEditor.xsd.desc.AbstractAnnotation',
	{
		/**
		 * Возвращает JSON.
		 * @return {Object}
		 */
		getJson: function (name)
		{
			var json;
			
			json = {
				"name": {
					"sequence": [
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3d:BasicTextType"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3d:BasicTextType"
								}
							}
						},
						{
							"element": {
								"br": {
									"name": "br"
								}
							}
						}
					]
				},
				"p": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"a": {
									"name": "a"
								}
							}
						]
					}
				},
				"br": {
					"sequence": []
				},
				"strong": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"a": {
									"name": "a"
								}
							}
						]
					}
				},
				"em": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"a": {
									"name": "a"
								}
							}
						]
					}
				},
				"a": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3d:BasicTextType"
								}
							},
							{
								"a": {
									"name": "a"
								}
							}
						]
					}
				}
			};
			
			json[name] = json.name;
			
			delete json.name;
			
			return json;
		},
		
		/**
		 * Вовзращает xsd.
		 * @return {String} Строка xsd.
		 */
		getXsd: function (name)
		{
			var xsd;

			xsd = '\
<?xml version="1.0" encoding="UTF-8"?>\
<schema xmlns="http://www.w3.org/2001/XMLSchema" xmlns:fb3d="http://www.fictionbook.org/FictionBook3/description" \
targetNamespace="http://www.fictionbook.org/FictionBook3/description" elementFormDefault="qualified" \
attributeFormDefault="unqualified">\
	<element name="' + name + '">\
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