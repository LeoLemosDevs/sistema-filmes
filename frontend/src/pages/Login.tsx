import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: any) => {
    try {
      setErrorMsg('');
      await login(data);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Erro ao realizar login.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-eca797962de5/369b56f8-4034-45e0-8193-41bb02ddce90/BR-pt-20240311-popsignuptwoweeks-perspective_alpha_website_small.jpg')] bg-cover bg-center"></div>
      
      <header className="absolute top-0 left-0 p-6 z-20 w-full bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-netflix-red text-4xl font-black uppercase tracking-wider">Filmes Stream</h1>
      </header>

      <main className="flex-grow flex items-center justify-center z-10 p-4">
        <div className="bg-black/80 p-12 rounded-lg w-full max-w-md shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8">Entrar</h2>
          
          {errorMsg && (
            <div className="bg-yellow-500 text-black p-3 rounded mb-4 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input 
                type="email" 
                placeholder="Email ou número de telefone" 
                className="w-full bg-[#333] text-white p-4 rounded focus:outline-none focus:bg-[#454545] transition-colors"
                {...register('email', { required: 'Email é obrigatório' })}
              />
              {errors.email && <p className="text-netflix-red text-xs mt-2">{(errors.email as any).message}</p>}
            </div>

            <div>
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full bg-[#333] text-white p-4 rounded focus:outline-none focus:bg-[#454545] transition-colors"
                {...register('password', { required: 'Senha é obrigatória' })}
              />
              {errors.password && <p className="text-netflix-red text-xs mt-2">{(errors.password as any).message}</p>}
            </div>

            <button type="submit" className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-4 rounded transition-colors duration-300 mt-6">
              Entrar
            </button>
          </form>

          <div className="mt-12 text-[#8c8c8c]">
            Novo por aqui? <Link to="/register" className="text-white hover:underline">Assine agora.</Link>
          </div>
        </div>
      </main>
    </div>
  );
};
