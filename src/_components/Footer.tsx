import React, { useState } from 'react';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";


const Footer = () => {
	return (
		 <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sobre</h3>
              <p className="text-gray-600 mb-4">Encontre e reserve as melhores quadras esportivas da sua região de forma rápida e fácil.</p>
              <div className="flex space-x-4">
                <button className="text-gray-700 hover:text-green-700">Facebook</button>
                <button className="text-gray-700 hover:text-green-700">Instagram</button>
                <button className="text-gray-700 hover:text-green-700">Twitter</button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-green-700">Ínicio</a></li>
                <li><a href="#" className="hover:text-green-700">Minhas Reservas</a></li>
                <li><a href="#" className="hover:text-green-700">Termos de uso</a></li>
                <li><a href="#" className="hover:text-green-700">Perguntas Frequentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contacto</h3>
               <ul className="space-y-2 text-gray-600">
                <li className="flex space-x-1 items-center hover:text-green-700"><MdOutlineMarkEmailRead className="text-xl"/><a href="#" >contacto@sport.com</a></li>
                <li className="flex space-x-1 items-center hover:text-green-700"><FaWhatsapp className="text-xl"/><a href="#" >Suporte via Whatsapp</a></li>
                <li className="flex space-x-1 items-center hover:text-green-700"><FaLocationDot className="text-xl"/><a href="#" >Camama, Golf 2</a></li>
              </ul>
              
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-700 text-sm">
            &copy; 2025 FieldpPro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
		);
}

export default Footer;